"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Eye, Share2, MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageOptimized } from "@/components/common/ImageOptimized";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { LikeButton } from "@/components/photo/LikeButton";
import { CommentList } from "@/components/comment/CommentList";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Photo } from "@/types/photo";
import { cn } from "@/lib/utils";

// 목 데이터 (실제 구현 시 API 호출로 대체)
const mockPhoto: Photo = {
    id: 1,
    title: "석양 속 고요한 순간",
    description: `바닷가에서 마주한 석양은 하루의 마지막을 알리는 신호였다. 파도가 발밑을 스치며 남긴 차가운 감촉과 따뜻한 햇살이 만나는 이 순간에서 나는 무언가 깊은 평온함을 느꼈다.

시간이 멈춘 듯한 고요함 속에서 자연이 주는 위로를 온몸으로 받아들였다. 매일 반복되는 일상에 지친 마음에게 바다는 끝없는 가능성을 속삭였고, 석양은 내일에 대한 희망을 전해주었다.

이 사진을 찍으면서 느꼈던 그 순간의 감정을 다시 한번 경험하고 싶어서, 그리고 이 아름다운 순간을 함께 나누고 싶어서 이곳에 공유한다.`,
    imageUrl: "/sunset-ocean-waves.png",
    thumbnailUrl: "/sunset-ocean-waves-thumb.png",
    author: {
        id: 1,
        username: "photographer",
        name: "김사진",
        profileImage: "/photographer-avatar.png",
    },
    stats: {
        views: 142,
        likes: 23,
        comments: 8,
    },
    createdAt: "2024-01-15T18:30:00Z",
    updatedAt: "2024-01-15T18:30:00Z",
    isLiked: false,
    visibility: "public",
    tags: ["석양", "바다", "자연", "감성", "여행"],
};

export default function PhotoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const photoId = parseInt(params.id as string);

    // 실제 구현 시 API 호출로 대체
    useEffect(() => {
        const fetchPhoto = async () => {
            setIsLoading(true);
            // 임시 딜레이
            await new Promise(resolve => setTimeout(resolve, 500));
            setPhoto(mockPhoto);
            setIsLoading(false);
        };

        fetchPhoto();
    }, [photoId]);

    const handleBack = () => {
        router.back();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: photo?.title,
                text: photo?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("링크가 복사되었습니다!");
        }
    };

    const handleDownload = () => {
        if (photo) {
            const link = document.createElement('a');
            link.href = photo.imageUrl;
            link.download = `${photo.title}.jpg`;
            link.click();
        }
    };

    const isAuthor = isAuthenticated && user?.id === photo?.author.id;
    const createdDate = photo ? new Date(photo.createdAt).toLocaleDateString("ko-KR") : "";

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!photo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-medium text-gray-600 mb-4">
                    사진을 찾을 수 없습니다
                </h1>
                <Button onClick={handleBack} variant="ghost">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    뒤로 가기
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <Button
                            onClick={handleBack}
                            variant="ghost"
                            className="text-gray-600 hover:text-black"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            돌아가기
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handleShare}
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-black"
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                            
                            <div className="relative">
                                <Button
                                    onClick={() => setShowMenu(!showMenu)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-black"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                                
                                {showMenu && (
                                    <div className="absolute right-0 top-10 z-20 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                                        <button
                                            onClick={handleDownload}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>다운로드</span>
                                        </button>
                                        {isAuthor && (
                                            <>
                                                <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    <span>편집</span>
                                                </button>
                                                <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    <span>삭제</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 사진 영역 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                            <div className="relative aspect-[4/3] bg-gray-100">
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <LoadingSpinner size="md" />
                                    </div>
                                )}
                                <ImageOptimized
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    fill
                                    objectFit="cover"
                                    className={cn(
                                        "transition-opacity duration-500",
                                        imageLoaded ? "opacity-100" : "opacity-0"
                                    )}
                                    onLoad={() => setImageLoaded(true)}
                                    fallbackSrc="/placeholder.svg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 - 사진 정보 */}
                    <div className="space-y-6">
                        {/* 작성자 정보 */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage 
                                        src={photo.author.profileImage} 
                                        alt={photo.author.name} 
                                    />
                                    <AvatarFallback>
                                        {photo.author.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-black">
                                        {photo.author.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        @{photo.author.username}
                                    </p>
                                </div>
                            </div>
                            
                            <Button
                                variant="outline"
                                className="w-full border-gray-200 hover:bg-gray-50"
                                disabled={isAuthor}
                            >
                                {isAuthor ? "내 작품" : "팔로우"}
                            </Button>
                        </div>

                        {/* 사진 제목 및 설명 */}
                        <div className="bg-white rounded-lg p-6">
                            <h1 className="text-2xl font-medium text-black mb-4 leading-tight">
                                {photo.title}
                            </h1>
                            
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                                {photo.description}
                            </p>

                            {/* 태그 */}
                            {photo.tags && photo.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {photo.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 통계 및 액션 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{photo.stats.views.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{createdDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <LikeButton
                                        photoId={photo.id}
                                        initialLikeCount={photo.stats.likes}
                                        initialIsLiked={photo.isLiked}
                                        variant="compact"
                                        showCount={false}
                                    />
                                    <span className="text-sm text-gray-600">
                                        {photo.stats.likes}명이 좋아합니다
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 댓글 섹션 */}
                <div className="mt-12" id="comments">
                    <CommentList
                        photoId={photo.id}
                        className="bg-white rounded-lg p-6"
                    />
                </div>
            </main>

            {/* 메뉴 닫기용 오버레이 */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-[5]"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}