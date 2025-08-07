import { 
    useQuery, 
    useMutation, 
    useQueryClient, 
    useInfiniteQuery 
} from "@tanstack/react-query";
import { 
    profileApi, 
    type ProfileInfo,
    type ProfileUpdateRequest,
    type PasswordChangeRequest,
    type AvatarUploadRequest
} from "@/lib/profileApi";
import type { PhotoListResponse } from "@/types/photo";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * 현재 사용자 프로필 조회
 */
export function useMyProfile() {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ["profile", "me"],
        queryFn: () => profileApi.getMyProfile(),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
        retry: 1,
    });
}

/**
 * 특정 사용자 프로필 조회
 */
export function useUserProfile(username: string, enabled = true) {
    return useQuery({
        queryKey: ["profile", username],
        queryFn: () => profileApi.getUserProfile(username),
        enabled: enabled && !!username,
        staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
        retry: 1,
    });
}

/**
 * 프로필 업데이트 뮤테이션
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: ProfileUpdateRequest) => profileApi.updateProfile(request),
        
        onSuccess: (updatedProfile) => {
            // 내 프로필 캐시 업데이트
            queryClient.setQueryData(["profile", "me"], updatedProfile);
            
            // 사용자명이 변경된 경우 해당 캐시도 업데이트
            if (updatedProfile.username) {
                queryClient.setQueryData(["profile", updatedProfile.username], updatedProfile);
            }

            // AuthProvider의 사용자 정보도 업데이트
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

            console.log(SUCCESS_MESSAGES.UPDATE_SUCCESS);
        },

        onError: (error: any) => {
            const errorMessage = error instanceof Error 
                ? error.message 
                : ERROR_MESSAGES.NETWORK_ERROR;
            
            console.error("프로필 업데이트 오류:", errorMessage);
        },
    });
}

/**
 * 프로필 이미지 업로드 뮤테이션
 */
export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AvatarUploadRequest) => profileApi.uploadAvatar(request),
        
        onSuccess: (data, variables) => {
            // 프로필 캐시의 이미지 URL 업데이트
            queryClient.setQueriesData(
                { queryKey: ["profile"] },
                (oldData: any) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            profileImage: data.profileImage,
                        };
                    }
                    return oldData;
                }
            );

            // AuthProvider의 사용자 정보도 업데이트
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

            console.log("프로필 이미지가 업데이트되었습니다.");
        },

        onError: (error: any) => {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "프로필 이미지 업로드에 실패했습니다.";
            
            console.error("프로필 이미지 업로드 오류:", errorMessage);
        },
    });
}

/**
 * 비밀번호 변경 뮤테이션
 */
export function useChangePassword() {
    return useMutation({
        mutationFn: (request: PasswordChangeRequest) => profileApi.changePassword(request),
        
        onSuccess: () => {
            console.log("비밀번호가 성공적으로 변경되었습니다.");
        },

        onError: (error: any) => {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "비밀번호 변경에 실패했습니다.";
            
            console.error("비밀번호 변경 오류:", errorMessage);
        },
    });
}

/**
 * 내 사진 목록 조회 (무한 스크롤)
 */
export function useMyPhotos() {
    const { isAuthenticated } = useAuth();

    return useInfiniteQuery({
        queryKey: ["photos", "me"],
        queryFn: ({ pageParam = 1 }) => profileApi.getMyPhotos(pageParam),
        enabled: isAuthenticated,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PhotoListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 특정 사용자 사진 목록 조회 (무한 스크롤)
 */
export function useUserPhotos(username: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["photos", "user", username],
        queryFn: ({ pageParam = 1 }) => profileApi.getUserPhotos(username, pageParam),
        enabled: enabled && !!username,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PhotoListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 좋아요한 사진 목록 조회 (무한 스크롤)
 */
export function useLikedPhotos() {
    const { isAuthenticated } = useAuth();

    return useInfiniteQuery({
        queryKey: ["photos", "liked"],
        queryFn: ({ pageParam = 1 }) => profileApi.getLikedPhotos(pageParam),
        enabled: isAuthenticated,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PhotoListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 댓글 단 사진 목록 조회 (무한 스크롤)
 */
export function useCommentedPhotos() {
    const { isAuthenticated } = useAuth();

    return useInfiniteQuery({
        queryKey: ["photos", "commented"],
        queryFn: ({ pageParam = 1 }) => profileApi.getCommentedPhotos(pageParam),
        enabled: isAuthenticated,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PhotoListResponse) => 
            lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 팔로우/언팔로우 뮤테이션
 */
export function useFollowUser() {
    const queryClient = useQueryClient();

    const followMutation = useMutation({
        mutationFn: (userId: number) => profileApi.followUser(userId),
        
        onSuccess: (data, userId) => {
            // 해당 사용자 프로필의 팔로워 수 및 팔로우 상태 업데이트
            queryClient.setQueriesData(
                { queryKey: ["profile"] },
                (oldData: any) => {
                    if (oldData && oldData.id === userId) {
                        return {
                            ...oldData,
                            isFollowing: data.isFollowing,
                            stats: {
                                ...oldData.stats,
                                followersCount: data.followersCount,
                            },
                        };
                    }
                    return oldData;
                }
            );

            // 팔로워/팔로잉 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ["followers"] });
            queryClient.invalidateQueries({ queryKey: ["following"] });
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: (userId: number) => profileApi.unfollowUser(userId),
        
        onSuccess: (data, userId) => {
            queryClient.setQueriesData(
                { queryKey: ["profile"] },
                (oldData: any) => {
                    if (oldData && oldData.id === userId) {
                        return {
                            ...oldData,
                            isFollowing: data.isFollowing,
                            stats: {
                                ...oldData.stats,
                                followersCount: data.followersCount,
                            },
                        };
                    }
                    return oldData;
                }
            );

            queryClient.invalidateQueries({ queryKey: ["followers"] });
            queryClient.invalidateQueries({ queryKey: ["following"] });
        },
    });

    return {
        follow: followMutation.mutate,
        unfollow: unfollowMutation.mutate,
        isFollowing: followMutation.isPending,
        isUnfollowing: unfollowMutation.isPending,
    };
}

/**
 * 팔로워 목록 조회
 */
export function useFollowers(username?: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["followers", username || "me"],
        queryFn: ({ pageParam = 1 }) => profileApi.getFollowers(username, pageParam),
        enabled,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => 
            lastPage.hasNextPage ? lastPage.hasNextPage : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 팔로잉 목록 조회
 */
export function useFollowing(username?: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["following", username || "me"],
        queryFn: ({ pageParam = 1 }) => profileApi.getFollowing(username, pageParam),
        enabled,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => 
            lastPage.hasNextPage ? lastPage.hasNextPage : undefined,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * 계정 삭제 뮤테이션
 */
export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (password: string) => profileApi.deleteAccount(password),
        
        onSuccess: () => {
            // 모든 캐시 초기화
            queryClient.clear();
            
            // 로그아웃 처리
            localStorage.removeItem("auth-token");
            window.location.href = "/";
        },

        onError: (error: any) => {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "계정 삭제에 실패했습니다.";
            
            console.error("계정 삭제 오류:", errorMessage);
        },
    });
}

/**
 * 프라이버시 설정 업데이트
 */
export function useUpdatePrivacy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (isPrivate: boolean) => profileApi.updatePrivacy(isPrivate),
        
        onSuccess: (updatedProfile) => {
            // 프로필 캐시 업데이트
            queryClient.setQueriesData(
                { queryKey: ["profile"] },
                (oldData: any) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            isPrivate: updatedProfile.isPrivate,
                        };
                    }
                    return oldData;
                }
            );

            console.log("프라이버시 설정이 업데이트되었습니다.");
        },

        onError: (error: any) => {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "프라이버시 설정 업데이트에 실패했습니다.";
            
            console.error("프라이버시 설정 오류:", errorMessage);
        },
    });
}