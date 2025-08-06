'use client';

import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-black" />
            <Link href="/feed">
              <span className="text-xl font-medium text-black">핀거스냅</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-black"
                >
                  로그아웃
                </Button>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Link href="/photo/upload">
                    <Camera className="w-4 h-4 mr-2" />
                    업로드
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  asChild
                  className="text-gray-600 hover:text-black"
                >
                  <Link href="/login">로그인</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Link href="/register">시작하기</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}