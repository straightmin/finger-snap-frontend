import { 
    useQuery, 
    useMutation, 
    useQueryClient, 
    useInfiniteQuery 
} from "@tanstack/react-query";
import { 
    commentApi, 
    type CommentRequest, 
    type CommentUpdateRequest,
    type CommentListResponse 
} from "@/lib/commentApi";
import type { Comment } from "@/types/photo";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { useAuth } from "@/components/providers/AuthProvider";

interface UseCommentsParams {
    photoId: number;
    enabled?: boolean;
}

interface UseCommentsReturn {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    refetch: () => void;
}

/**
 * 사진의 댓글 목록 조회 및 무한 스크롤 관리
 */
export function useComments({ photoId, enabled = true }: UseCommentsParams): UseCommentsReturn {
    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["comments", photoId],
        queryFn: ({ pageParam = 1 }) => commentApi.getComments(photoId, pageParam),
        enabled,
        initialPageParam: 1,
        getNextPageParam: (lastPage: CommentListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
    });

    // 모든 페이지의 댓글들을 하나의 배열로 합침
    const comments = data?.pages.flatMap(page => page.comments) ?? [];
    const totalCount = data?.pages[0]?.totalCount ?? 0;

    return {
        comments,
        isLoading,
        error: error instanceof Error ? error.message : null,
        totalCount,
        hasNextPage: !!hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    };
}

/**
 * 댓글 작성 뮤테이션
 */
export function useCreateComment(photoId: number) {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    return useMutation({
        mutationFn: (request: CommentRequest) => commentApi.createComment(request),
        
        onMutate: async (newComment) => {
            if (!isAuthenticated) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            // 댓글 목록 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ["comments", photoId] });

            // 이전 데이터 백업
            const previousComments = queryClient.getQueryData(["comments", photoId]);

            return { previousComments };
        },

        onSuccess: (newComment) => {
            // 댓글 목록에 새 댓글 추가 (최신 댓글이 위에 오도록)
            queryClient.setQueryData(
                ["comments", photoId],
                (old: any) => {
                    if (!old) return old;
                    
                    const updatedPages = [...old.pages];
                    if (updatedPages[0]) {
                        updatedPages[0] = {
                            ...updatedPages[0],
                            comments: [newComment, ...updatedPages[0].comments],
                            totalCount: updatedPages[0].totalCount + 1,
                        };
                    }
                    
                    return {
                        ...old,
                        pages: updatedPages,
                    };
                }
            );

            // 사진 목록의 댓글 수도 업데이트
            queryClient.setQueriesData(
                { queryKey: ["photos"] },
                (oldData: any) => {
                    if (!oldData) return oldData;
                    
                    const updatePhotoComments = (photos: any[]) => {
                        return photos.map((photo: any) => {
                            if (photo.id === photoId || photo.id === photoId.toString()) {
                                return {
                                    ...photo,
                                    stats: {
                                        ...photo.stats,
                                        comments: photo.stats.comments + 1,
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
                                photos: updatePhotoComments(page.photos || []),
                            })),
                        };
                    }
                    
                    // 일반 쿼리 데이터 구조 처리
                    if (oldData.photos) {
                        return {
                            ...oldData,
                            photos: updatePhotoComments(oldData.photos),
                        };
                    }
                    
                    return oldData;
                }
            );

            console.log(SUCCESS_MESSAGES.COMMENT_SUCCESS);
        },

        onError: (error: any, variables, context) => {
            // 에러 발생 시 이전 상태로 롤백
            if (context?.previousComments) {
                queryClient.setQueryData(["comments", photoId], context.previousComments);
            }

            const errorMessage = error instanceof Error 
                ? error.message 
                : ERROR_MESSAGES.NETWORK_ERROR;
            
            console.error("댓글 작성 오류:", errorMessage);
        },
    });
}

/**
 * 댓글 삭제 뮤테이션
 */
export function useDeleteComment(photoId: number) {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    return useMutation({
        mutationFn: (commentId: number) => commentApi.deleteComment(commentId),
        
        onMutate: async (commentId) => {
            if (!isAuthenticated) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            await queryClient.cancelQueries({ queryKey: ["comments", photoId] });
            const previousComments = queryClient.getQueryData(["comments", photoId]);

            // 낙관적 업데이트: 댓글 제거
            queryClient.setQueryData(
                ["comments", photoId],
                (old: any) => {
                    if (!old) return old;
                    
                    const updatedPages = old.pages.map((page: any) => ({
                        ...page,
                        comments: page.comments.filter((comment: Comment) => comment.id !== commentId),
                        totalCount: Math.max(0, page.totalCount - 1),
                    }));
                    
                    return {
                        ...old,
                        pages: updatedPages,
                    };
                }
            );

            return { previousComments, commentId };
        },

        onSuccess: (data, commentId) => {
            // 사진 목록의 댓글 수도 업데이트
            queryClient.setQueriesData(
                { queryKey: ["photos"] },
                (oldData: any) => {
                    if (!oldData) return oldData;
                    
                    const updatePhotoComments = (photos: any[]) => {
                        return photos.map((photo: any) => {
                            if (photo.id === photoId || photo.id === photoId.toString()) {
                                return {
                                    ...photo,
                                    stats: {
                                        ...photo.stats,
                                        comments: Math.max(0, photo.stats.comments - 1),
                                    },
                                };
                            }
                            return photo;
                        });
                    };

                    if (oldData.pages) {
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                photos: updatePhotoComments(page.photos || []),
                            })),
                        };
                    }
                    
                    if (oldData.photos) {
                        return {
                            ...oldData,
                            photos: updatePhotoComments(oldData.photos),
                        };
                    }
                    
                    return oldData;
                }
            );

            console.log(SUCCESS_MESSAGES.DELETE_SUCCESS);
        },

        onError: (error: any, variables, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(["comments", photoId], context.previousComments);
            }

            const errorMessage = error instanceof Error 
                ? error.message 
                : ERROR_MESSAGES.NETWORK_ERROR;
            
            console.error("댓글 삭제 오류:", errorMessage);
        },
    });
}

/**
 * 댓글 수정 뮤테이션
 */
export function useUpdateComment(photoId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, request }: { 
            commentId: number; 
            request: CommentUpdateRequest 
        }) => commentApi.updateComment(commentId, request),
        
        onSuccess: (updatedComment) => {
            // 댓글 목록에서 해당 댓글 업데이트
            queryClient.setQueryData(
                ["comments", photoId],
                (old: any) => {
                    if (!old) return old;
                    
                    const updatedPages = old.pages.map((page: any) => ({
                        ...page,
                        comments: page.comments.map((comment: Comment) => 
                            comment.id === updatedComment.id ? updatedComment : comment
                        ),
                    }));
                    
                    return {
                        ...old,
                        pages: updatedPages,
                    };
                }
            );

            console.log(SUCCESS_MESSAGES.UPDATE_SUCCESS);
        },

        onError: (error: any) => {
            const errorMessage = error instanceof Error 
                ? error.message 
                : ERROR_MESSAGES.NETWORK_ERROR;
            
            console.error("댓글 수정 오류:", errorMessage);
        },
    });
}

/**
 * 대댓글 목록 조회
 */
export function useReplies(parentCommentId: number, enabled = false) {
    return useInfiniteQuery({
        queryKey: ["replies", parentCommentId],
        queryFn: ({ pageParam = 1 }) => commentApi.getReplies(parentCommentId, pageParam),
        enabled,
        initialPageParam: 1,
        getNextPageParam: (lastPage: CommentListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 사용자별 댓글 목록 조회 (프로필용)
 */
export function useUserComments(userId?: number, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["user-comments", userId],
        queryFn: ({ pageParam = 1 }) => commentApi.getUserComments(userId, pageParam),
        enabled,
        initialPageParam: 1,
        getNextPageParam: (lastPage: CommentListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });
}