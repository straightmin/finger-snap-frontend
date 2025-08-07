"use client";

import { useState } from "react";
import { Heart, Filter, Calendar, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoGrid } from "@/components/profile/PhotoGrid";
import { useLikedPhotos } from "@/hooks/useProfile";
import type { PhotoViewMode } from "@/types/photo";
import { cn } from "@/lib/utils";

interface LikedPhotosProps {
    className?: string;
}

type SortBy = "latest" | "oldest" | "author";
type FilterBy = "all" | "thisMonth" | "thisYear";

export function LikedPhotos({ className }: LikedPhotosProps) {
    const [viewMode, setViewMode] = useState<PhotoViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortBy>("latest");
    const [filterBy, setFilterBy] = useState<FilterBy>("all");
    const [showFilters, setShowFilters] = useState(false);

    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useLikedPhotos();

    // 모든 페이지의 사진들을 하나의 배열로 합침
    const photos = data?.pages.flatMap(page => page.photos) ?? [];
    const totalCount = data?.pages[0]?.totalCount ?? 0;

    // 정렬 및 필터링 로직 (클라이언트 사이드)
    const filteredAndSortedPhotos = photos
        .filter((photo) => {
            if (filterBy === "all") return true;
            
            const photoDate = new Date(photo.createdAt);
            const now = new Date();
            
            if (filterBy === "thisMonth") {
                return photoDate.getMonth() === now.getMonth() && 
                       photoDate.getFullYear() === now.getFullYear();
            }
            
            if (filterBy === "thisYear") {
                return photoDate.getFullYear() === now.getFullYear();
            }
            
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "latest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sortBy === "author") {
                return a.author.name.localeCompare(b.author.name);
            }
            return 0;
        });

    const handleClearAllLikes = () => {
        if (window.confirm("정말로 모든 좋아요를 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            // TODO: 모든 좋아요 취소 API 호출
            alert("모든 좋아요 취소 기능은 추후 구현 예정입니다.");
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-medium text-black">
                            좋아요한 사진
                        </h2>
                        <p className="text-sm text-gray-500">
                            내가 좋아요를 누른 {totalCount.toLocaleString()}개의 사진
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* 필터 토글 */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "text-gray-600 hover:text-black",
                            showFilters && "bg-gray-100"
                        )}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        필터
                    </Button>

                    {/* 모든 좋아요 취소 */}
                    {totalCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAllLikes}
                            className="text-gray-600 hover:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            모두 취소
                        </Button>
                    )}
                </div>
            </div>

            {/* 필터 및 정렬 옵션 */}
            {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 정렬 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                정렬 기준
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={sortBy === "latest" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("latest")}
                                    className={sortBy === "latest" ? "bg-black text-white" : ""}
                                >
                                    <Calendar className="w-4 h-4 mr-1" />
                                    최신순
                                </Button>
                                <Button
                                    variant={sortBy === "oldest" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("oldest")}
                                    className={sortBy === "oldest" ? "bg-black text-white" : ""}
                                >
                                    <Calendar className="w-4 h-4 mr-1" />
                                    오래된순
                                </Button>
                                <Button
                                    variant={sortBy === "author" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("author")}
                                    className={sortBy === "author" ? "bg-black text-white" : ""}
                                >
                                    <User className="w-4 h-4 mr-1" />
                                    작성자순
                                </Button>
                            </div>
                        </div>

                        {/* 필터 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                기간 필터
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={filterBy === "all" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setFilterBy("all")}
                                    className={filterBy === "all" ? "bg-black text-white" : ""}
                                >
                                    전체
                                </Button>
                                <Button
                                    variant={filterBy === "thisMonth" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setFilterBy("thisMonth")}
                                    className={filterBy === "thisMonth" ? "bg-black text-white" : ""}
                                >
                                    이번 달
                                </Button>
                                <Button
                                    variant={filterBy === "thisYear" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setFilterBy("thisYear")}
                                    className={filterBy === "thisYear" ? "bg-black text-white" : ""}
                                >
                                    올해
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 필터 결과 정보 */}
                    <div className="text-sm text-gray-500 border-t border-gray-200 pt-3">
                        {filterBy !== "all" || sortBy !== "latest" ? (
                            <>
                                {filteredAndSortedPhotos.length}개의 사진이 표시됩니다
                                {filterBy === "thisMonth" && " (이번 달 좋아요)"}
                                {filterBy === "thisYear" && " (올해 좋아요)"}
                                {sortBy === "author" && " (작성자 이름순)"}
                                {sortBy === "oldest" && " (오래된 순)"}
                            </>
                        ) : (
                            "모든 좋아요한 사진을 최신순으로 표시합니다"
                        )}
                    </div>
                </div>
            )}

            {/* 사진 그리드 */}
            <PhotoGrid
                photos={filteredAndSortedPhotos}
                isLoading={isLoading}
                error={error instanceof Error ? error.message : null}
                hasNextPage={!!hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                totalCount={filteredAndSortedPhotos.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                emptyTitle="아직 좋아요한 사진이 없습니다"
                emptyDescription="마음에 드는 사진에 좋아요를 눌러보세요!"
            />

            {/* 좋아요 통계 */}
            {totalCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        💡 좋아요 통계
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="font-medium text-blue-800">
                                {totalCount}개
                            </div>
                            <div className="text-blue-700">총 좋아요</div>
                        </div>
                        <div>
                            <div className="font-medium text-blue-800">
                                {new Set(photos.map(p => p.author.username)).size}명
                            </div>
                            <div className="text-blue-700">작성자 수</div>
                        </div>
                        <div>
                            <div className="font-medium text-blue-800">
                                {photos.filter(p => {
                                    const date = new Date(p.createdAt);
                                    const now = new Date();
                                    return date.getMonth() === now.getMonth() && 
                                           date.getFullYear() === now.getFullYear();
                                }).length}개
                            </div>
                            <div className="text-blue-700">이번 달</div>
                        </div>
                        <div>
                            <div className="font-medium text-blue-800">
                                {photos.length > 0 ? photos[0].author.name : "-"}
                            </div>
                            <div className="text-blue-700">최근 작성자</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 좋아요한 사진 스켈레톤 로더
export function LikedPhotosSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-6 animate-pulse", className)}>
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-32 mb-1" />
                        <div className="h-4 bg-gray-200 rounded w-40" />
                    </div>
                </div>
                <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-16" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                </div>
            </div>

            {/* 필터 스켈레톤 */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                        <div className="flex gap-2">
                            <div className="h-8 bg-gray-200 rounded w-20" />
                            <div className="h-8 bg-gray-200 rounded w-24" />
                        </div>
                    </div>
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
                        <div className="flex gap-2">
                            <div className="h-8 bg-gray-200 rounded w-16" />
                            <div className="h-8 bg-gray-200 rounded w-20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 그리드 스켈레톤 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border rounded-lg overflow-hidden">
                        <div className="aspect-[4/3] bg-gray-200" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}