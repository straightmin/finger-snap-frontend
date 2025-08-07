"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register: registerUser } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        try {
            await registerUser(data.username, data.email, data.password);
            router.push("/feed");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "회원가입에 실패했습니다"
            );
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-center">회원가입</CardTitle>
                <CardDescription className="text-center">
                    핑거스냅에 가입하고 사진 이야기를 공유하세요
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* 사용자명 */}
                    <div className="space-y-2">
                        <Label htmlFor="username">사용자명</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="사용자명을 입력하세요"
                            {...register("username")}
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 입력하세요"
                                {...register("password")}
                                className={
                                    errors.password
                                        ? "border-red-500 pr-10"
                                        : "pr-10"
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            {...register("confirmPassword")}
                            className={
                                errors.confirmPassword ? "border-red-500" : ""
                            }
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* 오류 메시지 */}
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* 회원가입 버튼 */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                가입 중...
                            </>
                        ) : (
                            "회원가입"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
