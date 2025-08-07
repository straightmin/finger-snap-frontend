"use client";

import { useRef } from "react";
import { Grid3X3, List, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PhotoCard } from "@/components/photo/PhotoCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Photo, PhotoViewMode } from "@/types/photo";
import { cn } from "@/lib/utils";

interface PhotoGridProps {
    photos: Photo[];
    isLoading: boolean;
    error: string | null;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    totalCount: number;
    viewMode?: PhotoViewMode;
    onViewModeChange?: (mode: PhotoViewMode) => void;
    onUploadClick?: () => void;
    showUploadButton?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
}

export function PhotoGrid({
    photos,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    viewMode = "grid",
    onViewModeChange,
    onUploadClick,
    showUploadButton = false,
    emptyTitle = "아직 사진이 없습니다",
    emptyDescription = "첫 번째 사진을 업로드해보세요!",
    className,
}: PhotoGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);

    // 무한 스크롤 설정
    const { ref: infiniteScrollRef } = useInfiniteScroll({
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    });

    const handlePhotoClick = (photoId: string) => {
        window.location.href = `/photo/${photoId}`;
    };

    if (error) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-12", className)}>
                <Camera className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                    사진을 불러올 수 없습니다
                </h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button
                    variant="ghost"
                    onClick={() => window.location.reload()}
                    className="text-black hover:bg-gray-100"
                >
                    다시 시도
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* 헤더 - 통계 및 뷰 모드 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-black">
                        사진 {totalCount.toLocaleString()}개
                    </h3>
                </div>
                
                <div className="flex items-center space-x-3">
                    {/* 업로드 버튼 */}
                    {showUploadButton && (
                        <Button
                            onClick={onUploadClick}
                            size="sm"
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            업로드
                        </Button>
                    )}
                    
                    {/* 뷰 모드 전환 */}
                    {onViewModeChange && (
                        <div className="flex border border-gray-200 rounded-lg">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => onViewModeChange("grid")}
                                className={cn(
                                    "rounded-r-none border-r",
                                    viewMode === "grid" 
                                        ? "bg-black text-white" 
                                        : "text-gray-600 hover:text-black border-transparent"
                                )}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => onViewModeChange("list")}
                                className={cn(
                                    "rounded-l-none",
                                    viewMode === "list" 
                                        ? "bg-black text-white" 
                                        : "text-gray-600 hover:text-black"
                                )}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* 사진 그리드/리스트 */}
            {isLoading && photos.length === 0 ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : photos.length === 0 ? (
                /* 빈 상태 */
                <div className="text-center py-16">
                    <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-gray-600 mb-2">
                        {emptyTitle}
                    </h4>
                    <p className="text-gray-500 mb-6">
                        {emptyDescription}
                    </p>
                    {showUploadButton && (
                        <Button
                            onClick={onUploadClick}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            첫 사진 업로드하기
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {/* 사진 목록 */}
                    <div
                        ref={gridRef}
                        className={cn(
                            "grid gap-6",
                            viewMode === "grid" 
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                        )}
                    >
                        {photos.map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={{
                                    id: photo.id.toString(),
                                    title: photo.title,
                                    description: photo.description,
                                    imageUrl: photo.imageUrl,
                                    thumbnailUrl: photo.thumbnailUrl,
                                    author: {
                                        name: photo.author.name,
                                        username: photo.author.username,
                                        avatar: photo.author.profileImage || '',
                                    },
                                    stats: photo.stats,
                                    createdAt: photo.createdAt,
                                    isLiked: photo.isLiked,
                                }}
                                viewMode={viewMode}
                                onClick={handlePhotoClick}
                                className="transition-transform duration-200 hover:scale-[1.02]"
                            />
                        ))}
                    </div>

                    {/* 무한 스크롤 로딩 */}
                    {hasNextPage && (
                        <div
                            ref={infiniteScrollRef}
                            className="flex justify-center py-8"
                        >
                            {isFetchingNextPage ? (
                                <div className="flex items-center space-x-3 text-gray-500">
                                    <LoadingSpinner size="sm" />
                                    <span>사진을 더 불러오는 중...</span>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={fetchNextPage}
                                    className="text-gray-600 hover:text-black hover:bg-gray-100"
                                >
                                    사진 더 보기
                                </Button>
                            )}
                        </div>
                    )}

                    {/* 마지막 페이지 표시 */}
                    {!hasNextPage && photos.length >= 12 && (
                        <div className="text-center py-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                모든 사진을 불러왔습니다.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// 사진 그리드 스켈레톤 로더
export function PhotoGridSkeleton({ 
    viewMode = "grid",
    count = 6,
    className 
}: { 
    viewMode?: PhotoViewMode;
    count?: number;
    className?: string;
}) {
    return (
        <div className={cn("space-y-6", className)}>
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
                <div className="flex space-x-3">
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
            </div>

            {/* 그리드 스켈레톤 */}
            <div
                className={cn(
                    "grid gap-6 animate-pulse",
                    viewMode === "grid" 
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                )}
            >
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                        <div className="aspect-[4/3] bg-gray-200" />
                        <div className="p-6 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    <div className="h-4 bg-gray-200 rounded w-20" />
                                </div>
                                <div className="flex space-x-4">
                                    <div className="h-4 bg-gray-200 rounded w-8" />
                                    <div className="h-4 bg-gray-200 rounded w-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}