"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CommentItem } from "@/components/comment/CommentItem";
import { CommentForm } from "@/components/comment/CommentForm";
import { useComments } from "@/hooks/useComments";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Comment } from "@/types/photo";
import { cn } from "@/lib/utils";

interface CommentListProps {
    photoId: number;
    initialComments?: Comment[];
    className?: string;
    showForm?: boolean;
    maxHeight?: string;
}

export function CommentList({
    photoId,
    initialComments = [],
    className,
    showForm = true,
    maxHeight,
}: CommentListProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const {
        comments,
        isLoading,
        error,
        totalCount,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useComments({ photoId });

    // 무한 스크롤 설정
    const { ref: infiniteScrollRef } = useInfiniteScroll({
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    });

    // 새 댓글 작성 후 스크롤 위치 조정
    const scrollToTop = () => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (error) {
        return (
            <div className={cn(
                "flex flex-col items-center justify-center py-8 text-center",
                className
            )}>
                <MessageCircle className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-4">댓글을 불러올 수 없습니다.</p>
                <Button
                    variant="ghost"
                    onClick={() => refetch()}
                    className="text-black hover:bg-gray-100"
                >
                    다시 시도
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col space-y-6", className)}>
            {/* 댓글 작성 폼 */}
            {showForm && (
                <CommentForm
                    photoId={photoId}
                    onSuccess={scrollToTop}
                />
            )}

            {/* 댓글 통계 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-black">
                        댓글 {totalCount.toLocaleString()}개
                    </h3>
                </div>
                
                {comments.length > 5 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollToTop}
                        className="text-gray-600 hover:text-black"
                    >
                        <ArrowUp className="w-4 h-4 mr-1" />
                        맨 위로
                    </Button>
                )}
            </div>

            {/* 댓글 목록 */}
            <div
                ref={listRef}
                className={cn(
                    "space-y-6",
                    maxHeight && "overflow-y-auto",
                )}
                style={maxHeight ? { maxHeight } : undefined}
            >
                {/* 초기 로딩 */}
                {isLoading && comments.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner size="md" />
                    </div>
                ) : comments.length === 0 ? (
                    /* 댓글 없음 */
                    <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-600 mb-2">
                            아직 댓글이 없습니다
                        </h4>
                        <p className="text-gray-500 text-sm">
                            이 사진에 대한 첫 번째 댓글을 남겨보세요!
                        </p>
                    </div>
                ) : (
                    /* 댓글 아이템들 */
                    <>
                        {comments.map((comment, index) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                photoId={photoId}
                                className={cn(
                                    "pb-6 border-b border-gray-100",
                                    index === comments.length - 1 && !hasNextPage && "border-b-0 pb-0"
                                )}
                            />
                        ))}

                        {/* 무한 스크롤 트리거 */}
                        {hasNextPage && (
                            <div
                                ref={infiniteScrollRef}
                                className="flex justify-center py-6"
                            >
                                {isFetchingNextPage ? (
                                    <div className="flex items-center space-x-3 text-gray-500">
                                        <LoadingSpinner size="sm" />
                                        <span>댓글을 더 불러오는 중...</span>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        onClick={() => fetchNextPage()}
                                        className="text-gray-600 hover:text-black hover:bg-gray-100"
                                    >
                                        댓글 더 보기
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* 마지막 페이지 표시 */}
                        {!hasNextPage && comments.length >= 10 && (
                            <div className="text-center py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    모든 댓글을 불러왔습니다.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 댓글 작성 가이드 */}
            {comments.length === 0 && !isLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        💬 댓글 작성 가이드
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 작성자의 감정과 의도를 존중해주세요</li>
                        <li>• 건설적이고 따뜻한 피드백을 남겨주세요</li>
                        <li>• 개인적인 경험이나 감상을 공유해보세요</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

// 댓글 수 표시 컴포넌트 (PhotoCard에서 사용)
interface CommentCountProps {
    count: number;
    photoId: number;
    className?: string;
}

export function CommentCount({ count, photoId, className }: CommentCountProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        // 사진 상세 페이지로 이동하여 댓글 섹션으로 스크롤
        window.location.href = `/photo/${photoId}#comments`;
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex items-center space-x-1 text-gray-500 hover:text-black transition-colors duration-200",
                className
            )}
            title="댓글 보기"
        >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{count}</span>
        </button>
    );
}