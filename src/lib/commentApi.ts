import { apiClient } from "@/lib/api";
import { API_ENDPOINTS, PAGINATION } from "@/lib/constants";
import type { Comment } from "@/types/photo";

export interface CommentListResponse {
    comments: Comment[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
}

export interface CommentRequest {
    photoId: number;
    content: string;
    parentId?: number; // 대댓글용
}

export interface CommentUpdateRequest {
    content: string;
}

export const commentApi = {
    /**
     * 특정 사진의 댓글 목록 조회
     * @param photoId 사진 ID
     * @param page 페이지 번호 (기본값: 1)
     * @param limit 페이지당 댓글 수 (기본값: 10)
     * @returns 댓글 목록 응답
     */
    async getComments(
        photoId: number,
        page = 1,
        limit = PAGINATION.COMMENTS_PER_PAGE
    ): Promise<CommentListResponse> {
        return apiClient.get<CommentListResponse>(
            API_ENDPOINTS.PHOTOS.COMMENTS(photoId.toString()),
            { page, limit }
        );
    },

    /**
     * 댓글 작성
     * @param request 댓글 작성 요청 데이터
     * @returns 생성된 댓글 정보
     */
    async createComment(request: CommentRequest): Promise<Comment> {
        const { photoId, ...commentData } = request;
        return apiClient.post<Comment>(
            API_ENDPOINTS.PHOTOS.COMMENTS(photoId.toString()),
            commentData
        );
    },

    /**
     * 댓글 수정
     * @param commentId 댓글 ID
     * @param request 댓글 수정 요청 데이터
     * @returns 수정된 댓글 정보
     */
    async updateComment(
        commentId: number,
        request: CommentUpdateRequest
    ): Promise<Comment> {
        return apiClient.put<Comment>(
            `/comments/${commentId}`,
            request
        );
    },

    /**
     * 댓글 삭제
     * @param commentId 댓글 ID
     * @returns 삭제 완료 메시지
     */
    async deleteComment(commentId: number): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(
            API_ENDPOINTS.COMMENTS.DELETE(commentId.toString())
        );
    },

    /**
     * 대댓글 목록 조회
     * @param parentCommentId 부모 댓글 ID
     * @param page 페이지 번호
     * @param limit 페이지당 댓글 수
     * @returns 대댓글 목록
     */
    async getReplies(
        parentCommentId: number,
        page = 1,
        limit = PAGINATION.COMMENTS_PER_PAGE
    ): Promise<CommentListResponse> {
        return apiClient.get<CommentListResponse>(
            `/comments/${parentCommentId}/replies`,
            { page, limit }
        );
    },

    /**
     * 특정 댓글 상세 조회
     * @param commentId 댓글 ID
     * @returns 댓글 상세 정보
     */
    async getComment(commentId: number): Promise<Comment> {
        return apiClient.get<Comment>(`/comments/${commentId}`);
    },

    /**
     * 사용자의 댓글 목록 조회 (프로필용)
     * @param userId 사용자 ID (선택사항, 없으면 현재 로그인 사용자)
     * @param page 페이지 번호
     * @param limit 페이지당 댓글 수
     * @returns 사용자 댓글 목록
     */
    async getUserComments(
        userId?: number,
        page = 1,
        limit = PAGINATION.COMMENTS_PER_PAGE
    ): Promise<CommentListResponse> {
        const endpoint = userId 
            ? `/users/${userId}/comments`
            : "/users/me/comments";
        
        return apiClient.get<CommentListResponse>(endpoint, { page, limit });
    },

    /**
     * 댓글 신고
     * @param commentId 댓글 ID
     * @param reason 신고 사유
     * @returns 신고 완료 메시지
     */
    async reportComment(
        commentId: number, 
        reason: string
    ): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>(
            `/comments/${commentId}/report`,
            { reason }
        );
    }
};

export default commentApi;