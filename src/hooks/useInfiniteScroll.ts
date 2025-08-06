'use client';

import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll({
  hasNextPage = true,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 1000,
  rootMargin = '100px',
  enabled = true
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && enabled) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled]);

  const handleScroll = useCallback(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      handleLoadMore();
    }
  }, [enabled, hasNextPage, isFetchingNextPage, threshold, handleLoadMore]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, enabled]);

  useEffect(() => {
    if (!enabled || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          handleLoadMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasNextPage, isFetchingNextPage, rootMargin, handleLoadMore]);

  return { loadMoreRef };
}

export type { UseInfiniteScrollOptions };