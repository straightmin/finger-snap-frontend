"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Heart, Grid3X3, Settings, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProfileHeader, ProfileHeaderSkeleton } from "@/components/profile/ProfileHeader";
import { PhotoGrid, PhotoGridSkeleton } from "@/components/profile/PhotoGrid";
import { LikedPhotos, LikedPhotosSkeleton } from "@/components/profile/LikedPhotos";
import { useAuth } from "@/components/providers/AuthProvider";
import { useMyProfile, useMyPhotos } from "@/hooks/useProfile";
import type { PhotoViewMode } from "@/types/photo";
import { cn } from "@/lib/utils";

type TabType = "photos" | "liked" | "settings";

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("photos");
    const [viewMode, setViewMode] = useState<PhotoViewMode>("grid");

    // 프로필 데이터 조회
    const { 
        data: profile, 
        isLoading: profileLoading, 
        error: profileError 
    } = useMyProfile();

    // 내 사진 데이터 조회
    const {
        data: photosData,
        isLoading: photosLoading,
        error: photosError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useMyPhotos();

    const photos = photosData?.pages.flatMap(page => page.photos) ?? [];
    const totalPhotos = photosData?.pages[0]?.totalCount ?? 0;

    // 인증 체크
    if (!authLoading && !isAuthenticated) {
        router.push("/login");
        return null;
    }

    const handleEditProfile = () => {
        router.push("/profile/edit");
    };

    const handleSettings = () => {
        router.push("/settings");
    };

    const handleUploadClick = () => {
        router.push("/photo/upload");
    };

    const tabs = [
        {
            id: "photos" as TabType,
            label: "내 사진",
            icon: Camera,
            count: totalPhotos,
        },
        {
            id: "liked" as TabType,
            label: "좋아요",
            icon: Heart,
            count: profile?.stats.likesCount ?? 0,
        },
        {
            id: "settings" as TabType,
            label: "설정",
            icon: Settings,
            count: null,
        },
    ];

    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <ProfileHeaderSkeleton className="mb-8" />
                    <div className="flex justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (profileError || !profile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-medium text-gray-600 mb-4">
                            프로필을 불러올 수 없습니다
                        </h1>
                        <p className="text-gray-500 mb-6">
                            {profileError instanceof Error 
                                ? profileError.message 
                                : "프로필 정보를 가져오는 중 오류가 발생했습니다."
                            }
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="ghost"
                            className="text-black hover:bg-gray-100"
                        >
                            다시 시도
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* 프로필 헤더 */}
                <ProfileHeader
                    profile={profile}
                    onEditClick={handleEditProfile}
                    onSettingsClick={handleSettings}
                    className="mb-8"
                />

                {/* 탭 네비게이션 */}
                <div className="bg-white rounded-lg mb-8">
                    <div className="border-b border-gray-100">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-200",
                                        activeTab === tab.id
                                            ? "border-black text-black"
                                            : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                    {tab.count !== null && (
                                        <span className={cn(
                                            "px-2 py-1 text-xs rounded-full",
                                            activeTab === tab.id
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {tab.count.toLocaleString()}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* 탭 콘텐츠 */}
                    <div className="p-6">
                        {activeTab === "photos" && (
                            <PhotoGrid
                                photos={photos}
                                isLoading={photosLoading}
                                error={photosError instanceof Error ? photosError.message : null}
                                hasNextPage={!!hasNextPage}
                                fetchNextPage={fetchNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                totalCount={totalPhotos}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                onUploadClick={handleUploadClick}
                                showUploadButton
                                emptyTitle="아직 업로드한 사진이 없습니다"
                                emptyDescription="첫 번째 사진을 업로드하여 여러분의 이야기를 시작해보세요!"
                            />
                        )}

                        {activeTab === "liked" && (
                            <LikedPhotos />
                        )}

                        {activeTab === "settings" && (
                            <div className="space-y-8">
                                {/* 계정 설정 */}
                                <div>
                                    <h3 className="text-lg font-medium text-black mb-4">
                                        계정 설정
                                    </h3>
                                    <div className="space-y-4">
                                        <Button
                                            onClick={handleEditProfile}
                                            variant="outline"
                                            className="w-full justify-start border-gray-200 hover:bg-gray-50"
                                        >
                                            <Edit2 className="w-4 h-4 mr-3" />
                                            프로필 편집
                                        </Button>
                                        
                                        <Button
                                            onClick={() => router.push("/settings/privacy")}
                                            variant="outline"
                                            className="w-full justify-start border-gray-200 hover:bg-gray-50"
                                        >
                                            <Settings className="w-4 h-4 mr-3" />
                                            개인정보 설정
                                        </Button>
                                    </div>
                                </div>

                                {/* 통계 정보 */}
                                <div>
                                    <h3 className="text-lg font-medium text-black mb-4">
                                        활동 통계
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-medium text-black">
                                                {profile.stats.photosCount}
                                            </div>
                                            <div className="text-sm text-gray-500">업로드한 사진</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-medium text-black">
                                                {profile.stats.likesCount}
                                            </div>
                                            <div className="text-sm text-gray-500">받은 좋아요</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-medium text-black">
                                                {profile.stats.commentsCount}
                                            </div>
                                            <div className="text-sm text-gray-500">받은 댓글</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-medium text-black">
                                                {profile.stats.followersCount}
                                            </div>
                                            <div className="text-sm text-gray-500">팔로워</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 빠른 작업 */}
                                <div>
                                    <h3 className="text-lg font-medium text-black mb-4">
                                        빠른 작업
                                    </h3>
                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleUploadClick}
                                            className="w-full justify-start bg-black text-white hover:bg-gray-800"
                                        >
                                            <Camera className="w-4 h-4 mr-3" />
                                            새 사진 업로드
                                        </Button>
                                        
                                        <Button
                                            onClick={() => router.push("/feed")}
                                            variant="outline"
                                            className="w-full justify-start border-gray-200 hover:bg-gray-50"
                                        >
                                            <Grid3X3 className="w-4 h-4 mr-3" />
                                            피드 둘러보기
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}