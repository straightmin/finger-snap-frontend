import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';
import { Camera } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      {/* 로고 */}
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <Camera className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold">핀거스냅</span>
        </Link>
      </div>

      {/* 로그인 폼 */}
      <LoginForm />

      {/* 회원가입 링크 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          아직 계정이 없으신가요?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}