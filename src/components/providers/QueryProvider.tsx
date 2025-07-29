'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 스튤일 우선순위가 낮을 때 새로고침 방지
            refetchOnWindowFocus: false,
            // 네트워크 재연결시 자동 새로고침
            refetchOnReconnect: true,
            // 5분간 캐시 유지
            staleTime: 5 * 60 * 1000,
            // 오류 재시도 횟수
            retry: (failureCount, error: any) => {
              // 401, 403, 404 오류는 재시도하지 않음
              if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
                return false;
              }
              // 3번까지 재시도
              return failureCount < 3;
            },
          },
          mutations: {
            // 뮤테이션 오류 재시도 횟수
            retry: (failureCount, error: any) => {
              // 400번대 오류는 재시도하지 않음
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}