export interface UserProfile {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
    bio?: string;
    createdAt: string;
    photosCount: number;
    likesCount: number;
    followersCount: number;
}

export interface UpdateProfileRequest {
    username?: string;
    bio?: string;
    profileImage?: File;
}