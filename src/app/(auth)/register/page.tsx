import Link from 'next/link';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { Camera } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      {/* 로고 */}
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <Camera className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold">핀거스냅</span>
        </Link>
      </div>

      {/* 회원가입 폼 */}
      <RegisterForm />

      {/* 로그인 링크 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}