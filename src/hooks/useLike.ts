import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likeApi, type LikeRequest, type LikeResponse } from "@/lib/likeApi";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { useAuth } from "@/components/providers/AuthProvider";
// toast 라이브러리 대신 콘솔이나 alert 사용

interface UseLikeParams {
    photoId: number;
    initialLikeCount?: number;
    initialIsLiked?: boolean;
}

interface UseLikeReturn {
    isLiked: boolean;
    likeCount: number;
    isLoading: boolean;
    error: string | null;
    toggleLike: () => void;
    canLike: boolean;
}

export function useLike({
    photoId,
    initialLikeCount = 0,
    initialIsLiked = false,
}: UseLikeParams): UseLikeReturn {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    // Query key for this photo's like status
    const queryKey = ["like-status", photoId];

    // 좋아요 상태 조회 (초기값 있으면 비활성화)
    const { data } = useQuery({
        queryKey,
        queryFn: () => likeApi.getLikeStatus(photoId),
        enabled: false, // 초기 데이터가 있으므로 자동 fetch 비활성화
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
        initialData: {
            isLiked: initialIsLiked,
            likeCount: initialLikeCount,
        },
    });

    // 좋아요 토글 뮤테이션
    const { mutate: toggleLike, isPending: isLoading, error } = useMutation({
        mutationFn: (request: LikeRequest) => likeApi.toggleLike(request),
        
        // 낙관적 업데이트
        onMutate: async () => {
            // 이전 데이터 백업
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData<{
                isLiked: boolean;
                likeCount: number;
            }>(queryKey);

            // 낙관적으로 UI 업데이트
            queryClient.setQueryData(queryKey, (old: any) => ({
                isLiked: !old.isLiked,
                likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
            }));

            // 관련된 사진 목록도 업데이트
            queryClient.setQueriesData(
                { queryKey: ["photos"] },
                (oldData: any) => {
                    if (!oldData) return oldData;
                    
                    const updatePhotoLikes = (photos: any[]) => {
                        return photos.map((photo: any) => {
                            if (photo.id === photoId || photo.id === photoId.toString()) {
                                return {
                                    ...photo,
                                    isLiked: !photo.isLiked,
                                    stats: {
                                        ...photo.stats,
                                        likes: photo.isLiked 
                                            ? photo.stats.likes - 1 
                                            : photo.stats.likes + 1,
                                    },
                                };
                            }
                            return photo;
                        });
                    };

                    // 무한 쿼리 데이터 구조 처리
                    if (oldData.pages) {
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                photos: updatePhotoLikes(page.photos || []),
                            })),
                        };
                    }
                    
                    // 일반 쿼리 데이터 구조 처리
                    if (oldData.photos) {
                        return {
                            ...oldData,
                            photos: updatePhotoLikes(oldData.photos),
                        };
                    }
                    
                    return oldData;
                }
            );

            return { previousData };
        },

        onSuccess: (data: LikeResponse) => {
            // 서버 응답으로 최종 상태 업데이트
            queryClient.setQueryData(queryKey, {
                isLiked: data.isLiked,
                likeCount: data.likeCount,
            });

            // 성공 메시지 (선택적)
            console.log(data.isLiked ? SUCCESS_MESSAGES.LIKE_SUCCESS : SUCCESS_MESSAGES.UNLIKE_SUCCESS);
        },

        onError: (error: any, variables, context) => {
            // 에러 발생 시 이전 상태로 롤백
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }

            // 관련 쿼리들 무효화하여 최신 데이터로 다시 fetch
            queryClient.invalidateQueries({ queryKey: ["photos"] });
            queryClient.invalidateQueries({ queryKey });

            // 에러 메시지 표시
            const errorMessage = error instanceof Error 
                ? error.message 
                : ERROR_MESSAGES.NETWORK_ERROR;
            
            console.error(errorMessage);
        },
    });

    const handleToggleLike = () => {
        if (!isAuthenticated) {
            console.warn(ERROR_MESSAGES.UNAUTHORIZED);
            alert(ERROR_MESSAGES.UNAUTHORIZED);
            return;
        }

        toggleLike({ photoId });
    };

    return {
        isLiked: data?.isLiked ?? initialIsLiked,
        likeCount: data?.likeCount ?? initialLikeCount,
        isLoading,
        error: error instanceof Error ? error.message : null,
        toggleLike: handleToggleLike,
        canLike: isAuthenticated,
    };
}

// 특정 사진의 좋아요 목록 조회용 훅
export function usePhotoLikes(photoId: number, enabled = false) {
    return useQuery({
        queryKey: ["photo-likes", photoId],
        queryFn: () => likeApi.getPhotoLikes(photoId),
        enabled,
        staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
    });
}

// 내가 좋아요한 사진 목록 조회용 훅
export function useLikedPhotos(page = 1) {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ["liked-photos", page],
        queryFn: () => likeApi.getLikedPhotos(page),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });
}