'use client';

import Link from 'next/link';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageOptimized } from '@/components/common/ImageOptimized';
import type { PhotoCard as PhotoCardType, PhotoViewMode } from '@/types/photo';

interface PhotoCardProps {
  photo: PhotoCardType;
  viewMode: PhotoViewMode;
  className?: string;
  onClick?: (photoId: string) => void;
}

export function PhotoCard({ 
  photo, 
  viewMode, 
  className = '', 
  onClick 
}: PhotoCardProps) {
  const handleClick = () => {
    onClick?.(photo.id);
  };

  const truncatedDescription = photo.description.length > 150 
    ? photo.description.slice(0, 150) + '...' 
    : photo.description;

  if (viewMode === 'list') {
    return (
      <article 
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors duration-200 cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="aspect-[4/3] md:aspect-square overflow-hidden">
              <ImageOptimized
                src={photo.imageUrl}
                alt={photo.title}
                fill
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                fallbackSrc="/placeholder.svg"
              />
            </div>
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <h2 className="text-xl font-medium text-black mb-4 leading-tight hover:text-gray-700 transition-colors">
              <Link href={`/photo/${photo.id}`}>
                {photo.title}
              </Link>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
              {photo.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={photo.author.avatar} 
                    alt={photo.author.name} 
                  />
                  <AvatarFallback>
                    {photo.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {photo.author.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    @{photo.author.username}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{photo.stats.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{photo.stats.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{photo.stats.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageOptimized
          src={photo.imageUrl}
          alt={photo.title}
          fill
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          fallbackSrc="/placeholder.svg"
        />
      </div>
      <div className="p-6">
        <h2 className="text-lg font-medium text-black mb-3 leading-tight group-hover:text-gray-700 transition-colors">
          <Link href={`/photo/${photo.id}`}>
            {photo.title}
          </Link>
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {truncatedDescription}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={photo.author.avatar} 
                alt={photo.author.name}
              />
              <AvatarFallback>
                {photo.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {photo.author.name}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{photo.stats.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{photo.stats.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{photo.stats.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}