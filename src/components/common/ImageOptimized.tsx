'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: 'square' | '4/3' | '3/2' | '16/9';
  objectFit?: 'cover' | 'contain' | 'fill';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoadingComplete?: () => void;
  fallbackSrc?: string;
}

export function ImageOptimized({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes,
  aspectRatio,
  objectFit = 'cover',
  placeholder = 'empty',
  blurDataURL,
  onLoadingComplete,
  fallbackSrc = '/placeholder.svg'
}: ImageOptimizedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    'square': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '16/9': 'aspect-video'
  };

  const containerClassName = `relative overflow-hidden ${
    aspectRatio ? aspectRatioClasses[aspectRatio] : ''
  } ${className}`;

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={containerClassName}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'}`}
        onLoad={handleLoadingComplete}
        onError={handleError}
      />
    </div>
  );
}