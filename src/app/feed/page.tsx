"use client";

import { useState, useCallback } from "react";
import { Search, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PhotoCard } from "@/components/photo/PhotoCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type {
    PhotoCard as PhotoCardType,
    PhotoSortBy,
    PhotoViewMode,
} from "@/types/photo";
import { PHOTO_SORT_OPTIONS } from "@/lib/constants";

const mockPhotos: PhotoCardType[] = [
    {
        id: "1",
        title: "석양 속 고요한 순간",
        description:
            "바닷가에서 마주한 석양은 하루의 마지막을 알리는 신호였다. 파도가 발밑을 스치며 남긴 차가운 감촉과 따뜻한 햇살이 만나는 이 순간에서 나는 무언가 깊은 평온함을 느꼈다. 시간이 멈춘 듯한 고요함 속에서 자연이 주는 위로를 온몸으로 받아들였다.",
        imageUrl: "/sunset-ocean-waves.png",
        author: {
            name: "김사진",
            username: "photographer",
            avatar: "/photographer-avatar.png",
        },
        stats: { views: 142, likes: 23, comments: 8 },
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        title: "도시의 밤, 네온사인 속 고독",
        description:
            "비에 젖은 아스팔트 위로 반사되는 네온사인들이 도시의 밤을 물들인다. 수많은 사람들이 지나가지만 각자의 세계에 갇혀 있는 듯한 이 순간, 현대인의 고독을 카메라에 담았다. 화려한 불빛 뒤에 숨겨진 진짜 이야기를 찾고 싶었다.",
        imageUrl: "/rainy-neon-street.png",
        author: {
            name: "이도시",
            username: "urbanexplorer",
            avatar: "/urban-photographer-avatar.png",
        },
        stats: { views: 89, likes: 15, comments: 4 },
        createdAt: "2024-01-14",
    },
    {
        id: "3",
        title: "할머니의 손",
        description:
            "80년의 세월이 새겨진 할머니의 손을 보며 시간의 무게를 느꼈다. 주름 하나하나에는 삶의 이야기가, 굳은살에는 사랑하는 가족을 위한 헌신이 담겨 있었다. 이 사진을 통해 우리가 잊고 살았던 소중한 것들을 다시 한번 생각해보게 되었다.",
        imageUrl: "/elderly-hands.png",
        author: {
            name: "박가족",
            username: "familystory",
            avatar: "/family-photographer-avatar.png",
        },
        stats: { views: 234, likes: 45, comments: 12 },
        createdAt: "2024-01-13",
    },
    {
        id: "4",
        title: "새벽 안개 속 숲길",
        description:
            "새벽 5시, 안개가 자욱한 숲길을 걸으며 자연의 신비로움을 마주했다. 발걸음 소리만이 고요함을 깨뜨리는 이 순간, 도시의 소음에 지친 마음이 치유되는 것을 느꼈다. 안개 사이로 스며드는 첫 햇살이 마치 희망의 메시지 같았다.",
        imageUrl: "/misty-forest-dawn.png",
        author: {
            name: "최자연",
            username: "naturelover",
            avatar: "/nature-photographer-avatar.png",
        },
        stats: { views: 167, likes: 31, comments: 6 },
        createdAt: "2024-01-12",
    },
    {
        id: "5",
        title: "카페 창가의 오후",
        description:
            "창밖으로 스며드는 따스한 오후 햇살과 김이 모락모락 피어오르는 커피 한 잔. 바쁜 일상 속에서 잠시 멈춰 서서 나만의 시간을 갖는 이 순간이 얼마나 소중한지 깨달았다. 단순한 일상 속에서도 아름다움을 발견할 수 있다는 것을 보여주고 싶었다.",
        imageUrl: "/coffee-cup-afternoon.png",
        author: {
            name: "정일상",
            username: "dailymoments",
            avatar: "/lifestyle-photographer-avatar.png",
        },
        stats: { views: 98, likes: 19, comments: 3 },
        createdAt: "2024-01-11",
    },
    {
        id: "6",
        title: "아이의 순수한 미소",
        description:
            "공원에서 뛰어노는 아이의 천진난만한 미소를 보며 잃어버린 순수함을 떠올렸다. 어른이 되면서 잊고 살았던 단순한 기쁨과 순간의 행복이 무엇인지 다시 생각하게 되었다. 이 미소 하나가 세상의 모든 복잡함을 잊게 만들어 주었다.",
        imageUrl: "/happy-child-park.png",
        author: {
            name: "한순간",
            username: "momentcatcher",
            avatar: "/child-photographer-avatar.png",
        },
        stats: { views: 203, likes: 38, comments: 9 },
        createdAt: "2024-01-10",
    },
];

export default function FeedPage() {
    const [photos, setPhotos] = useState<PhotoCardType[]>(mockPhotos);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<PhotoSortBy>("latest");
    const [viewMode, setViewMode] = useState<PhotoViewMode>("grid");
    const [hasMore, setHasMore] = useState(true);

    const loadMorePhotos = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        setTimeout(() => {
            const newPhotos = mockPhotos.map((photo) => ({
                ...photo,
                id: photo.id + "_" + Date.now(),
            }));
            setPhotos((prev) => [...prev, ...newPhotos]);
            setLoading(false);

            if (photos.length > 30) {
                setHasMore(false);
            }
        }, 1000);
    }, [loading, hasMore, photos.length]);

    const { loadMoreRef } = useInfiniteScroll({
        hasNextPage: hasMore,
        isFetchingNextPage: loading,
        fetchNextPage: loadMorePhotos,
        enabled: true,
    });

    const filteredPhotos = photos.filter(
        (photo) =>
            photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            photo.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            photo.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedPhotos = [...filteredPhotos].sort((a, b) => {
        switch (sortBy) {
            case "popular":
                return b.stats.likes - a.stats.likes;
            case "comments":
                return b.stats.comments - a.stats.comments;
            default:
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
        }
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Search and Filter Section */}
            <section className="py-12 bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="사진 이야기 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-0"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as PhotoSortBy)
                                }
                                className="w-32 border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:border-gray-500 focus:outline-none focus:ring-0"
                            >
                                {PHOTO_SORT_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex border border-gray-300 rounded">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className={`px-3 py-2 ${
                                        viewMode === "grid" ? "bg-gray-100" : ""
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={`px-3 py-2 ${
                                        viewMode === "list" ? "bg-gray-100" : ""
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Feed */}
            <main className="py-8">
                <div className="max-w-6xl mx-auto px-6">
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {sortedPhotos.map((photo) => (
                                <PhotoCard
                                    key={photo.id}
                                    photo={photo}
                                    viewMode="grid"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {sortedPhotos.map((photo) => (
                                <PhotoCard
                                    key={photo.id}
                                    photo={photo}
                                    viewMode="list"
                                />
                            ))}
                        </div>
                    )}

                    {/* Infinite scroll trigger */}
                    <div ref={loadMoreRef} className="h-10" />

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner text="더 많은 이야기를 불러오는 중..." />
                        </div>
                    )}

                    {/* End of content */}
                    {!hasMore && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            모든 사진 이야기를 확인했습니다.
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="text-2xl font-light text-black mb-2">
                                10,000+
                            </div>
                            <div className="text-sm text-gray-600">
                                사진 이야기
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-light text-black mb-2">
                                5,000+
                            </div>
                            <div className="text-sm text-gray-600">작가들</div>
                        </div>
                        <div>
                            <div className="text-2xl font-light text-black mb-2">
                                50,000+
                            </div>
                            <div className="text-sm text-gray-600">팔로워</div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 핀거스냅. 사진 속 감정과 의미를 깊이 있게 나누는
                        스토리텔링 중심의 사진 커뮤니티입니다.
                    </p>
                </div>
            </footer>
        </div>
    );
}
