export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  author: {
    id: number;
    username: string;
    profileImage?: string;
  };
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface PhotoUploadRequest {
  title: string;
  description: string;
  file: File;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
  replies?: Comment[];
}