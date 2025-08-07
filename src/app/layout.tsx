import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "핑거스냅 - 사진 이야기 커뮤니티",
    description:
        "사진에 담긴 이야기와 해석을 중심으로 공유하는 설명 기반 사진 커뮤니티 플랫폼",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>
                    <AuthProvider>
                        <Header />
                        {children}
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
