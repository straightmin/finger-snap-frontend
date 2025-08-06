export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  author: {
    id: number;
    username: string;
    name: string;
    profileImage?: string;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  visibility: 'public' | 'private';
  tags?: string[];
}

export interface PhotoCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
}

export interface PhotoUploadRequest {
  title: string;
  description: string;
  file: File;
  tags?: string[];
  visibility?: 'public' | 'private';
}

export interface PhotoUploadData {
  file: File;
  preview: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  parentId?: number;
}

export interface Like {
  id: number;
  userId: number;
  photoId?: number;
  commentId?: number;
  createdAt: string;
}

export interface PhotoListResponse {
  photos: Photo[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface PhotoDetailResponse extends Photo {
  comments: Comment[];
  relatedPhotos?: Photo[];
}

export type PhotoSortBy = 'latest' | 'popular' | 'comments';
export type PhotoViewMode = 'grid' | 'list';
export type PhotoVisibility = 'public' | 'private';