'use client';

import Link from 'next/link';
import { Camera, Search, Upload, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/AuthProvider';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* 로고 */}
        <Link href="/feed" className="flex items-center space-x-2">
          <Camera className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">핀거스냅</span>
        </Link>

        {/* 검색바 (데스크톱만) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="사진 검색..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* 내비게이션 */}
        <nav className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* 모바일 검색 버튰 */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
              
              {/* 업로드 버튰 */}
              <Button variant="ghost" size="icon" asChild>
                <Link href="/photo/upload">
                  <Upload className="h-5 w-5" />
                </Link>
              </Button>

              {/* 사용자 메뉴 */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt={user?.username} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
                
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}