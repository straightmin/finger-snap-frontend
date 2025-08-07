import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Like } from "@/types/photo";

export interface LikeResponse {
    message: string;
    isLiked: boolean;
    likeCount: number;
}

export interface LikeRequest {
    photoId: number;
    commentId?: number;
}

export const likeApi = {
    /**
     * 좋아요 추가/취소 토글
     * @param request 좋아요 요청 데이터
     * @returns 좋아요 상태 및 개수
     */
    async toggleLike(request: LikeRequest): Promise<LikeResponse> {
        return apiClient.post<LikeResponse>(API_ENDPOINTS.LIKES, request);
    },

    /**
     * 사진의 좋아요 상태 조회
     * @param photoId 사진 ID
     * @returns 좋아요 상태 및 개수
     */
    async getLikeStatus(photoId: number): Promise<{ isLiked: boolean; likeCount: number }> {
        return apiClient.get<{ isLiked: boolean; likeCount: number }>(
            `${API_ENDPOINTS.LIKES}/status/${photoId}`
        );
    },

    /**
     * 내가 좋아요한 사진 목록 조회
     * @param page 페이지 번호 (선택사항)
     * @param limit 페이지당 개수 (선택사항)
     * @returns 좋아요한 사진 목록
     */
    async getLikedPhotos(page = 1, limit = 12) {
        return apiClient.get(API_ENDPOINTS.PHOTOS.LIKED, {
            page,
            limit,
        });
    },

    /**
     * 특정 사진의 좋아요 목록 조회
     * @param photoId 사진 ID
     * @param page 페이지 번호
     * @param limit 페이지당 개수
     * @returns 좋아요 한 사용자 목록
     */
    async getPhotoLikes(photoId: number, page = 1, limit = 20): Promise<{
        likes: Like[];
        totalCount: number;
        hasMore: boolean;
    }> {
        return apiClient.get(`${API_ENDPOINTS.LIKES}/photo/${photoId}`, {
            page,
            limit,
        });
    },
};

export default likeApi;