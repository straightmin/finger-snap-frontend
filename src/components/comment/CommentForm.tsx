"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCreateComment } from "@/hooks/useComments";
import type { CommentRequest } from "@/lib/commentApi";
import { cn } from "@/lib/utils";

interface CommentFormProps {
    photoId: number;
    parentId?: number; // 대댓글용
    placeholder?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
    compact?: boolean;
    autoFocus?: boolean;
}

export function CommentForm({
    photoId,
    parentId,
    placeholder = "댓글을 작성해보세요...",
    onSuccess,
    onCancel,
    className,
    compact = false,
    autoFocus = false,
}: CommentFormProps) {
    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(autoFocus);
    const { isAuthenticated, user } = useAuth();
    const { mutate: createComment, isPending } = useCreateComment(photoId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() || !isAuthenticated) return;

        const request: CommentRequest = {
            photoId,
            content: content.trim(),
            ...(parentId && { parentId }),
        };

        createComment(request, {
            onSuccess: () => {
                setContent("");
                setIsFocused(false);
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        setContent("");
        setIsFocused(false);
        onCancel?.();
    };

    const handleFocus = () => {
        if (!isAuthenticated) {
            alert("로그인이 필요합니다.");
            return;
        }
        setIsFocused(true);
    };

    if (!isAuthenticated) {
        return (
            <div className={cn(
                "flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200",
                className
            )}>
                <p className="text-gray-500 text-sm">
                    댓글을 작성하려면{" "}
                    <a href="/login" className="text-black font-medium hover:underline">
                        로그인
                    </a>
                    이 필요합니다.
                </p>
            </div>
        );
    }

    // 컴팩트 버전 (대댓글용)
    if (compact) {
        return (
            <form onSubmit={handleSubmit} className={cn("flex flex-col space-y-3", className)}>
                <div className="flex space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={user?.profileImage} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={handleFocus}
                            placeholder={placeholder}
                            className={cn(
                                "w-full min-h-[80px] p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg",
                                "focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-10 focus:border-black",
                                "placeholder:text-gray-500 resize-none transition-all duration-200"
                            )}
                            autoFocus={autoFocus}
                            disabled={isPending}
                            maxLength={500}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                                {content.length}/500
                            </span>
                            <div className="flex space-x-2">
                                {onCancel && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isPending}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        취소
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!content.trim() || isPending}
                                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-1" />
                                            작성 중...
                                        </>
                                    ) : (
                                        "답글"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    // 기본 버전 (메인 댓글용)
    return (
        <div className={cn(
            "bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200",
            isFocused && "border-black shadow-sm",
            className
        )}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={user?.profileImage} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={() => !content.trim() && setIsFocused(false)}
                            placeholder={placeholder}
                            className={cn(
                                "w-full min-h-[100px] p-4 bg-gray-50 border border-gray-200 rounded-lg",
                                "focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-10 focus:border-black",
                                "placeholder:text-gray-500 resize-none transition-all duration-200",
                                isFocused && "min-h-[120px]"
                            )}
                            disabled={isPending}
                            maxLength={1000}
                        />
                    </div>
                </div>

                {/* 확장된 상태에서만 표시되는 하단 영역 */}
                {(isFocused || content.trim()) && (
                    <div className="flex items-center justify-between pl-14">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{content.length}/1000</span>
                            {parentId && (
                                <span className="text-blue-600">답글 작성 중</span>
                            )}
                        </div>
                        
                        <div className="flex space-x-3">
                            {(isFocused || content.trim()) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleCancel}
                                    disabled={isPending}
                                    className="text-gray-600 hover:text-black"
                                >
                                    취소
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={!content.trim() || isPending}
                                className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        작성 중...
                                    </>
                                ) : (
                                    parentId ? "답글 작성" : "댓글 작성"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            {/* 댓글 작성 팁 (처음 포커스 시에만 표시) */}
            {isFocused && !content.trim() && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <strong>좋은 댓글 작성 팁:</strong> 작성자의 관점과 느낌을 존중하며, 
                        건설적이고 따뜻한 피드백을 남겨주세요.
                    </p>
                </div>
            )}
        </div>
    );
}