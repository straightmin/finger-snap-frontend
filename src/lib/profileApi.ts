import { apiClient } from "@/lib/api";
import { API_ENDPOINTS, PAGINATION } from "@/lib/constants";
import type { User } from "@/types/user";
import type { Photo, PhotoListResponse } from "@/types/photo";

export interface ProfileStats {
    photosCount: number;
    likesCount: number;
    commentsCount: number;
    followersCount: number;
    followingCount: number;
}

export interface ProfileInfo extends User {
    stats: ProfileStats;
    joinedAt: string;
    isFollowing?: boolean;
    isFollowedBy?: boolean;
}

export interface ProfileUpdateRequest {
    name?: string;
    username?: string;
    email?: string;
    bio?: string;
    website?: string;
    location?: string;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AvatarUploadRequest {
    file: File;
}

export const profileApi = {
    /**
     * 현재 사용자 프로필 조회
     * @returns 사용자 프로필 정보
     */
    async getMyProfile(): Promise<ProfileInfo> {
        return apiClient.get<ProfileInfo>("/users/me");
    },

    /**
     * 특정 사용자 프로필 조회
     * @param username 사용자명
     * @returns 사용자 프로필 정보
     */
    async getUserProfile(username: string): Promise<ProfileInfo> {
        return apiClient.get<ProfileInfo>(API_ENDPOINTS.USERS.PROFILE(username));
    },

    /**
     * 프로필 정보 업데이트
     * @param request 업데이트할 프로필 정보
     * @returns 업데이트된 프로필 정보
     */
    async updateProfile(request: ProfileUpdateRequest): Promise<ProfileInfo> {
        return apiClient.put<ProfileInfo>(API_ENDPOINTS.USERS.UPDATE_PROFILE, request);
    },

    /**
     * 프로필 이미지 업로드
     * @param request 프로필 이미지 파일
     * @returns 업로드된 이미지 URL 정보
     */
    async uploadAvatar(request: AvatarUploadRequest): Promise<{ profileImage: string }> {
        const formData = new FormData();
        formData.append("avatar", request.file);
        
        return apiClient.postFormData<{ profileImage: string }>(
            "/users/me/avatar", 
            formData
        );
    },

    /**
     * 비밀번호 변경
     * @param request 비밀번호 변경 요청
     * @returns 성공 메시지
     */
    async changePassword(request: PasswordChangeRequest): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>(
            "/users/me/password",
            request
        );
    },

    /**
     * 내가 업로드한 사진 목록 조회
     * @param page 페이지 번호
     * @param limit 페이지당 사진 수
     * @returns 사진 목록
     */
    async getMyPhotos(
        page = 1, 
        limit = PAGINATION.PHOTOS_PER_PAGE
    ): Promise<PhotoListResponse> {
        return apiClient.get<PhotoListResponse>("/users/me/photos", {
            page,
            limit,
        });
    },

    /**
     * 특정 사용자가 업로드한 사진 목록 조회
     * @param username 사용자명
     * @param page 페이지 번호
     * @param limit 페이지당 사진 수
     * @returns 사진 목록
     */
    async getUserPhotos(
        username: string,
        page = 1,
        limit = PAGINATION.PHOTOS_PER_PAGE
    ): Promise<PhotoListResponse> {
        return apiClient.get<PhotoListResponse>(
            `/users/${username}/photos`,
            { page, limit }
        );
    },

    /**
     * 내가 좋아요한 사진 목록 조회
     * @param page 페이지 번호
     * @param limit 페이지당 사진 수
     * @returns 좋아요한 사진 목록
     */
    async getLikedPhotos(
        page = 1,
        limit = PAGINATION.PHOTOS_PER_PAGE
    ): Promise<PhotoListResponse> {
        return apiClient.get<PhotoListResponse>(API_ENDPOINTS.PHOTOS.LIKED, {
            page,
            limit,
        });
    },

    /**
     * 내가 댓글 단 사진 목록 조회
     * @param page 페이지 번호
     * @param limit 페이지당 사진 수
     * @returns 댓글 단 사진 목록
     */
    async getCommentedPhotos(
        page = 1,
        limit = PAGINATION.PHOTOS_PER_PAGE
    ): Promise<PhotoListResponse> {
        return apiClient.get<PhotoListResponse>("/users/me/commented-photos", {
            page,
            limit,
        });
    },

    /**
     * 사용자 팔로우
     * @param userId 팔로우할 사용자 ID
     * @returns 팔로우 상태
     */
    async followUser(userId: number): Promise<{ 
        isFollowing: boolean;
        followersCount: number;
    }> {
        return apiClient.post<{ 
            isFollowing: boolean;
            followersCount: number;
        }>(`/users/${userId}/follow`);
    },

    /**
     * 사용자 언팔로우
     * @param userId 언팔로우할 사용자 ID
     * @returns 팔로우 상태
     */
    async unfollowUser(userId: number): Promise<{ 
        isFollowing: boolean;
        followersCount: number;
    }> {
        return apiClient.delete<{ 
            isFollowing: boolean;
            followersCount: number;
        }>(`/users/${userId}/follow`);
    },

    /**
     * 팔로워 목록 조회
     * @param username 사용자명 (없으면 본인)
     * @param page 페이지 번호
     * @param limit 페이지당 사용자 수
     * @returns 팔로워 목록
     */
    async getFollowers(
        username?: string,
        page = 1,
        limit = 20
    ): Promise<{
        users: User[];
        totalCount: number;
        hasNextPage: boolean;
    }> {
        const endpoint = username 
            ? `/users/${username}/followers`
            : "/users/me/followers";
            
        return apiClient.get(endpoint, { page, limit });
    },

    /**
     * 팔로잉 목록 조회
     * @param username 사용자명 (없으면 본인)
     * @param page 페이지 번호
     * @param limit 페이지당 사용자 수
     * @returns 팔로잉 목록
     */
    async getFollowing(
        username?: string,
        page = 1,
        limit = 20
    ): Promise<{
        users: User[];
        totalCount: number;
        hasNextPage: boolean;
    }> {
        const endpoint = username 
            ? `/users/${username}/following`
            : "/users/me/following";
            
        return apiClient.get(endpoint, { page, limit });
    },

    /**
     * 계정 비활성화
     * @param reason 비활성화 사유
     * @returns 성공 메시지
     */
    async deactivateAccount(reason?: string): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>("/users/me/deactivate", {
            reason,
        });
    },

    /**
     * 계정 삭제
     * @param password 확인용 비밀번호
     * @returns 성공 메시지
     */
    async deleteAccount(password: string): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>("/users/me", {
            password,
        });
    },

    /**
     * 프로필 공개/비공개 설정
     * @param isPrivate 비공개 여부
     * @returns 업데이트된 프로필 정보
     */
    async updatePrivacy(isPrivate: boolean): Promise<ProfileInfo> {
        return apiClient.put<ProfileInfo>("/users/me/privacy", {
            isPrivate,
        });
    }
};

export default profileApi;