import { z } from "zod";

// 로그인 폼 스키마
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "이메일을 입력해주세요")
        .email("유효한 이메일 주소를 입력해주세요"),
    password: z
        .string()
        .min(1, "비밀번호를 입력해주세요")
        .min(6, "비밀번호는 6자 이상이어야 합니다"),
});

// 회원가입 폼 스키마
export const registerSchema = z
    .object({
        username: z
            .string()
            .min(1, "사용자를 입력해주세요")
            .min(2, "사용자명은 2자 이상이어야 합니다")
            .max(20, "사용자명은 20자 이하여야 합니다")
            .regex(/^[a-zA-Z0-9_]+$/, "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다"),
        email: z
            .string()
            .min(1, "이메일을 입력해주세요")
            .email("유효한 이메일 주소를 입력해주세요"),
        password: z
            .string()
            .min(1, "빔밀번호를 입력해주세요")
            .min(6, "비밀번호는 6자 이상이어야 합니다")
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "비밀번호는 영문과 숫자를 포함해야 합니다"),
        confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "비밀번호가 일치하지 않습니다",
        path: ["confirmPassword"],
    });

// 사진 업로드 폼 스키마
export const photoUploadSchema = z.object({
    title: z
        .string()
        .min(1, "제목을 입력해주세요")
        .max(100, "제목은 100자 이하로 입력해주세요"),
    description: z
        .string()
        .min(50, "설명은 50자 이상 입력해주세요")
        .max(1000, "설명은 1000자 이하로 입력해주세요"),
    file: z
        .instanceof(File, { message: "파일을 선택해주세요" })
        .refine((file) => file.size <= 10 * 1024 * 1024, "파일은 10MB 이하로 업로드해주세요")
        .refine(
            (file) => ["image/jpeg", "image/png"].includes(file.type),
            "JPG, PNG 파일만 업로드 가능합니다"
        ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PhotoUploadFormData = z.infer<typeof photoUploadSchema>;