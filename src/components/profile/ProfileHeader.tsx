"use client";

import { useState } from "react";
import { Calendar, MapPin, Link as LinkIcon, Edit2, Settings, UserPlus, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFollowUser } from "@/hooks/useProfile";
import type { ProfileInfo } from "@/lib/profileApi";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
    profile: ProfileInfo;
    isLoading?: boolean;
    onEditClick?: () => void;
    onSettingsClick?: () => void;
    className?: string;
}

export function ProfileHeader({
    profile,
    isLoading = false,
    onEditClick,
    onSettingsClick,
    className,
}: ProfileHeaderProps) {
    const { user, isAuthenticated } = useAuth();
    const { follow, unfollow, isFollowing: isFollowLoading, isUnfollowing } = useFollowUser();
    const [imageError, setImageError] = useState(false);

    const isOwnProfile = isAuthenticated && user?.id === profile.id;
    const joinedDate = new Date(profile.joinedAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
    });

    const handleFollowClick = () => {
        if (!isAuthenticated) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (profile.isFollowing) {
            unfollow(profile.id);
        } else {
            follow(profile.id);
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    };

    if (isLoading) {
        return (
            <div className={cn("bg-white rounded-lg p-8", className)}>
                <div className="flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className={cn("bg-white rounded-lg overflow-hidden", className)}>
            {/* 커버 이미지 영역 (추후 구현) */}
            <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200" />
            
            <div className="px-8 pb-8">
                {/* 프로필 이미지 및 기본 정보 */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                    <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                        {/* 프로필 이미지 */}
                        <div className="relative">
                            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                <AvatarImage 
                                    src={!imageError ? profile.profileImage : undefined}
                                    alt={profile.name}
                                    onError={() => setImageError(true)}
                                />
                                <AvatarFallback className="text-2xl bg-gray-200">
                                    {profile.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            
                            {/* 온라인 상태 표시 (추후 구현) */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
                        </div>

                        {/* 기본 정보 */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-medium text-black mb-2 truncate">
                                {profile.name}
                            </h1>
                            <p className="text-lg text-gray-600 mb-3">
                                @{profile.username}
                            </p>
                            
                            {profile.bio && (
                                <p className="text-gray-800 leading-relaxed mb-4 max-w-md">
                                    {profile.bio}
                                </p>
                            )}

                            {/* 부가 정보 */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{joinedDate}에 가입</span>
                                </div>
                                
                                {profile.location && (
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                
                                {profile.website && (
                                    <div className="flex items-center space-x-1">
                                        <LinkIcon className="w-4 h-4" />
                                        <a 
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-black hover:underline"
                                        >
                                            웹사이트
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex space-x-3 mt-4 md:mt-0">
                        {isOwnProfile ? (
                            <>
                                <Button
                                    onClick={onEditClick}
                                    variant="outline"
                                    className="border-gray-200 hover:bg-gray-50"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    프로필 편집
                                </Button>
                                <Button
                                    onClick={onSettingsClick}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-black"
                                >
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleFollowClick}
                                    disabled={isFollowLoading || isUnfollowing}
                                    className={cn(
                                        "transition-all duration-200",
                                        profile.isFollowing
                                            ? "bg-gray-100 text-black hover:bg-red-50 hover:text-red-600"
                                            : "bg-black text-white hover:bg-gray-800"
                                    )}
                                >
                                    {isFollowLoading || isUnfollowing ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : profile.isFollowing ? (
                                        <UserMinus className="w-4 h-4 mr-2" />
                                    ) : (
                                        <UserPlus className="w-4 h-4 mr-2" />
                                    )}
                                    {profile.isFollowing ? "언팔로우" : "팔로우"}
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    className="border-gray-200 hover:bg-gray-50"
                                >
                                    메시지
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="flex flex-wrap gap-8 pt-6 border-t border-gray-100">
                    <div className="text-center">
                        <div className="text-2xl font-medium text-black">
                            {formatNumber(profile.stats.photosCount)}
                        </div>
                        <div className="text-sm text-gray-500">사진</div>
                    </div>
                    
                    <button className="text-center hover:opacity-80 transition-opacity">
                        <div className="text-2xl font-medium text-black">
                            {formatNumber(profile.stats.followersCount)}
                        </div>
                        <div className="text-sm text-gray-500">팔로워</div>
                    </button>
                    
                    <button className="text-center hover:opacity-80 transition-opacity">
                        <div className="text-2xl font-medium text-black">
                            {formatNumber(profile.stats.followingCount)}
                        </div>
                        <div className="text-sm text-gray-500">팔로잉</div>
                    </button>
                    
                    <div className="text-center">
                        <div className="text-2xl font-medium text-black">
                            {formatNumber(profile.stats.likesCount)}
                        </div>
                        <div className="text-sm text-gray-500">받은 좋아요</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 프로필 스켈레톤 로더
export function ProfileHeaderSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("bg-white rounded-lg overflow-hidden animate-pulse", className)}>
            {/* 커버 이미지 */}
            <div className="h-32 bg-gray-200" />
            
            <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                    <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                        {/* 프로필 이미지 */}
                        <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white" />
                        
                        {/* 기본 정보 */}
                        <div className="flex-1 min-w-0">
                            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
                            <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-64 mb-4" />
                            <div className="flex gap-4">
                                <div className="h-4 bg-gray-200 rounded w-24" />
                                <div className="h-4 bg-gray-200 rounded w-20" />
                            </div>
                        </div>
                    </div>
                    
                    {/* 액션 버튼 */}
                    <div className="flex space-x-3 mt-4 md:mt-0">
                        <div className="h-10 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-200 rounded w-10" />
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="flex gap-8 pt-6 border-t border-gray-100">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="text-center">
                            <div className="h-6 bg-gray-200 rounded w-12 mb-1" />
                            <div className="h-4 bg-gray-200 rounded w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}