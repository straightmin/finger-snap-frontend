"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types/auth";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const {
        isAuthenticated,
        user,
        isLoading,
        login: storeLogin,
        register: storeRegister,
        logout: storeLogout,
        initializeAuth,
    } = useAuthStore();

    // 앱 시작시 인증 상태 초기화
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = async (email: string, password: string) => {
        await storeLogin({ email, password });
    };

    const register = async (
        username: string,
        email: string,
        password: string
    ) => {
        await storeRegister({ username, email, password });
    };

    const logout = async () => {
        await storeLogout();
    };

    const value: AuthContextType = {
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
