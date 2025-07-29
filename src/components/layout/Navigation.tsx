'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    href: '/feed',
    label: '피드',
    icon: Home,
  },
  {
    href: '/photo/upload',
    label: '업로드',
    icon: Camera,
  },
  {
    href: '/search',
    label: '검색',
    icon: Search,
  },
  {
    href: '/profile',
    label: '프로필',
    icon: User,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-3 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-1', isActive && 'fill-current')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}