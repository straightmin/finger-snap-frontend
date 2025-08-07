"use client";

import { useState } from "react";
// 시간 표시 유틸리티 함수
const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    
    return date.toLocaleDateString("ko-KR");
};
import { MoreHorizontal, Reply, Edit2, Trash2, Flag, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/components/comment/CommentForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { useDeleteComment, useUpdateComment } from "@/hooks/useComments";
import type { Comment } from "@/types/photo";
import { cn } from "@/lib/utils";

interface CommentItemProps {
    comment: Comment;
    photoId: number;
    isReply?: boolean;
    onReplyClick?: (commentId: number) => void;
    onEditComplete?: () => void;
    className?: string;
    showReplies?: boolean;
}

export function CommentItem({
    comment,
    photoId,
    isReply = false,
    onReplyClick,
    onEditComplete,
    className,
    showReplies = true,
}: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    
    const { user, isAuthenticated } = useAuth();
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(photoId);
    const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(photoId);

    const isAuthor = isAuthenticated && user?.id === comment.author.id;
    const createdAt = new Date(comment.createdAt);
    const timeAgo = formatTimeAgo(createdAt);

    const handleEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSaveEdit = () => {
        if (editContent.trim() === comment.content) {
            setIsEditing(false);
            return;
        }

        updateComment(
            {
                commentId: comment.id,
                request: { content: editContent.trim() },
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    onEditComplete?.();
                },
            }
        );
    };

    const handleCancelEdit = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            deleteComment(comment.id);
        }
        setShowMenu(false);
    };

    const handleReply = () => {
        setShowReplyForm(!showReplyForm);
        onReplyClick?.(comment.id);
    };

    const handleReport = () => {
        // TODO: 신고 기능 구현
        alert("신고 기능은 추후 구현 예정입니다.");
        setShowMenu(false);
    };

    return (
        <article className={cn(
            "group relative",
            isReply && "ml-8 mt-3", // 대댓글 들여쓰기
            className
        )}>
            <div className="flex space-x-3">
                {/* 프로필 이미지 */}
                <Avatar className={cn(
                    "flex-shrink-0",
                    isReply ? "w-8 h-8" : "w-10 h-10"
                )}>
                    <AvatarImage 
                        src={comment.author.profileImage} 
                        alt={comment.author.name} 
                    />
                    <AvatarFallback>
                        {comment.author.name[0]}
                    </AvatarFallback>
                </Avatar>

                {/* 댓글 내용 */}
                <div className="flex-1 min-w-0">
                    {/* 작성자 정보 */}
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-black">
                            {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                            @{comment.author.username}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <time className="text-xs text-gray-400">
                            {timeAgo}
                        </time>
                        {comment.updatedAt !== comment.createdAt && (
                            <span className="text-xs text-gray-400">(수정됨)</span>
                        )}
                    </div>

                    {/* 댓글 내용 또는 수정 폼 */}
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={cn(
                                    "w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg",
                                    "focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-10 focus:border-black",
                                    "resize-none min-h-[80px]"
                                )}
                                maxLength={1000}
                                disabled={isUpdating}
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                    {editContent.length}/1000
                                </span>
                                <div className="flex space-x-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancelEdit}
                                        disabled={isUpdating}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleSaveEdit}
                                        disabled={!editContent.trim() || isUpdating}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        {isUpdating ? "저장 중..." : "저장"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 댓글 텍스트 */}
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>

                            {/* 액션 버튼들 */}
                            <div className="flex items-center space-x-4 mt-3">
                                {/* 좋아요 버튼 (추후 구현) */}
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-400 transition-colors duration-200">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-xs">0</span>
                                </button>

                                {/* 답글 버튼 */}
                                {!isReply && (
                                    <button
                                        onClick={handleReply}
                                        className="flex items-center space-x-1 text-gray-500 hover:text-black transition-colors duration-200"
                                    >
                                        <Reply className="w-4 h-4" />
                                        <span className="text-xs">답글</span>
                                    </button>
                                )}

                                {/* 메뉴 버튼 */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-1 text-gray-400 hover:text-black transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 top-8 z-10 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                            {isAuthor ? (
                                                <>
                                                    <button
                                                        onClick={handleEdit}
                                                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span>수정</span>
                                                    </button>
                                                    <button
                                                        onClick={handleDelete}
                                                        disabled={isDeleting}
                                                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span>{isDeleting ? "삭제 중..." : "삭제"}</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={handleReport}
                                                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Flag className="w-4 h-4" />
                                                    <span>신고</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* 답글 작성 폼 */}
                    {showReplyForm && !isReply && (
                        <div className="mt-4">
                            <CommentForm
                                photoId={photoId}
                                parentId={comment.id}
                                placeholder={`@${comment.author.username}님에게 답글...`}
                                compact
                                autoFocus
                                onSuccess={() => setShowReplyForm(false)}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}

                    {/* 대댓글 표시 */}
                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    photoId={photoId}
                                    isReply
                                    showReplies={false} // 대댓글의 대댓글은 표시하지 않음
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 클릭 영역 밖을 클릭하면 메뉴 닫기 */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-[5]"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </article>
    );
}