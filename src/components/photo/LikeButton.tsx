"use client";

import { Heart } from "lucide-react";
import { useLike } from "@/hooks/useLike";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    photoId: number;
    initialLikeCount?: number;
    initialIsLiked?: boolean;
    variant?: "default" | "compact";
    showCount?: boolean;
    className?: string;
    iconClassName?: string;
    countClassName?: string;
}

export function LikeButton({
    photoId,
    initialLikeCount = 0,
    initialIsLiked = false,
    variant = "default",
    showCount = true,
    className,
    iconClassName,
    countClassName,
}: LikeButtonProps) {
    const { isLiked, likeCount, isLoading, toggleLike, canLike } = useLike({
        photoId,
        initialLikeCount,
        initialIsLiked,
    });

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모 요소(PhotoCard) 클릭 이벤트 방지
        e.preventDefault();
        toggleLike();
    };

    // 컴팩트 버전 (아이콘만)
    if (variant === "compact") {
        return (
            <button
                onClick={handleClick}
                disabled={!canLike || isLoading}
                className={cn(
                    "group relative p-2 rounded-full transition-all duration-200",
                    "hover:bg-red-50 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                title={isLiked ? "좋아요 취소" : "좋아요"}
            >
                <div className="relative">
                    <Heart
                        className={cn(
                            "w-5 h-5 transition-all duration-300",
                            isLiked
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-gray-500 group-hover:text-red-400 group-hover:scale-110",
                            isLoading && "animate-pulse",
                            iconClassName
                        )}
                    />
                    {/* 좋아요 시 펄스 효과 */}
                    {isLiked && (
                        <div className="absolute inset-0 animate-ping opacity-30">
                            <Heart className="w-5 h-5 text-red-400" />
                        </div>
                    )}
                </div>
                {showCount && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                        {likeCount}
                    </span>
                )}
            </button>
        );
    }

    // 기본 버전 (아이콘 + 숫자)
    return (
        <button
            onClick={handleClick}
            disabled={!canLike || isLoading}
            className={cn(
                "group relative flex items-center space-x-1 transition-all duration-200",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 rounded-lg px-1 py-1",
                isLiked && "animate-in zoom-in-150 duration-300",
                className
            )}
            title={isLiked ? "좋아요 취소" : "좋아요"}
        >
            <div className="relative">
                <Heart
                    className={cn(
                        "w-4 h-4 transition-all duration-300",
                        isLiked
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-gray-500 group-hover:text-red-400 group-hover:scale-110",
                        isLoading && "animate-pulse",
                        iconClassName
                    )}
                />
                {/* 좋아요 시 펄스 효과 */}
                {isLiked && (
                    <div className="absolute inset-0 animate-ping">
                        <Heart className="w-4 h-4 text-red-400 opacity-75" />
                    </div>
                )}
                {/* 클릭 시 파티클 효과를 위한 요소들 */}
                {isLiked && (
                    <>
                        <div className="absolute -top-1 -left-1 w-1 h-1 bg-red-400 rounded-full animate-bounce opacity-70" 
                             style={{ animationDelay: '0.1s' }} />
                        <div className="absolute -top-1 -right-1 w-1 h-1 bg-red-400 rounded-full animate-bounce opacity-70"
                             style={{ animationDelay: '0.2s' }} />
                        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-red-400 rounded-full animate-bounce opacity-70"
                             style={{ animationDelay: '0.3s' }} />
                        <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-red-400 rounded-full animate-bounce opacity-70"
                             style={{ animationDelay: '0.4s' }} />
                    </>
                )}
            </div>
            {showCount && (
                <span
                    className={cn(
                        "text-sm transition-colors duration-200 select-none",
                        isLiked
                            ? "text-red-500 font-medium"
                            : "text-gray-500 group-hover:text-red-400",
                        countClassName
                    )}
                >
                    {likeCount}
                </span>
            )}
            
            {/* 로딩 상태 시각적 표시 */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded">
                    <div className="w-3 h-3 border border-gray-300 border-t-red-500 rounded-full animate-spin" />
                </div>
            )}
        </button>
    );
}

// 큰 버전의 좋아요 버튼 (사진 상세 페이지용)
interface LikeButtonLargeProps extends Omit<LikeButtonProps, 'variant'> {
    size?: "sm" | "md" | "lg";
}

export function LikeButtonLarge({
    photoId,
    initialLikeCount = 0,
    initialIsLiked = false,
    size = "md",
    showCount = true,
    className,
    iconClassName,
    countClassName,
}: LikeButtonLargeProps) {
    const { isLiked, likeCount, isLoading, toggleLike, canLike } = useLike({
        photoId,
        initialLikeCount,
        initialIsLiked,
    });

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        toggleLike();
    };

    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5", 
        lg: "w-6 h-6",
    };

    return (
        <button
            onClick={handleClick}
            disabled={!canLike || isLoading}
            className={cn(
                "group relative flex items-center space-x-2 rounded-lg border transition-all duration-200",
                "bg-white hover:bg-gray-50 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isLiked
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500",
                sizeClasses[size],
                className
            )}
        >
            <Heart
                className={cn(
                    "transition-all duration-300",
                    isLiked
                        ? "fill-red-500 text-red-500 animate-in zoom-in-150 duration-200"
                        : "text-gray-500 group-hover:text-red-400 group-hover:scale-110",
                    isLoading && "animate-pulse",
                    iconSizes[size],
                    iconClassName
                )}
            />
            
            {showCount && (
                <span
                    className={cn(
                        "font-medium transition-colors duration-200 select-none",
                        isLiked ? "text-red-600" : "group-hover:text-red-500",
                        countClassName
                    )}
                >
                    {likeCount}
                </span>
            )}
            
            <span className="font-medium">
                {isLiked ? "좋아요 취소" : "좋아요"}
            </span>

            {/* 로딩 오버레이 */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="w-4 h-4 border border-gray-300 border-t-red-500 rounded-full animate-spin" />
                </div>
            )}
        </button>
    );
}