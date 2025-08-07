import { create } from "zustand";
import { AuthState, LoginRequest, RegisterRequest } from "@/types/auth";
import { authApi, tokenUtils } from "@/lib/auth";

interface AuthStore extends AuthState {
    // Actions
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    initializeAuth: () => void;
    refreshUser: () => Promise<void>;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    // Initial state
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,

    // 로그인
    login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
            const response = await authApi.login(credentials);
            set({
                isAuthenticated: true,
                user: response.user,
                token: response.token,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    // 회원가입
    register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
            const response = await authApi.register(userData);
            set({
                isAuthenticated: true,
                user: response.user,
                token: response.token,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    // 로그아웃
    logout: async () => {
        set({ isLoading: true });
        try {
            await authApi.logout();
        } catch (error) {
            console.warn("로그아웃 중 오류:", error);
        } finally {
            set({
                isAuthenticated: false,
                user: null,
                token: null,
                isLoading: false,
            });
        }
    },

    // 인증 상태 초기화 (앱 시작시 호출)
    initializeAuth: () => {
        const token = tokenUtils.getToken();
        const user = tokenUtils.getUser();

        if (token && user && tokenUtils.isTokenValid()) {
            set({
                isAuthenticated: true,
                user,
                token,
                isLoading: false,
            });
        } else {
            // 유효하지 않은 토큰이면 지우기
            tokenUtils.clearAuth();
            set({
                isAuthenticated: false,
                user: null,
                token: null,
                isLoading: false,
            });
        }
    },

    // 사용자 정보 새로고침
    refreshUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
            const user = await authApi.getMe();
            set({ user });
            // localStorage에도 업데이트
            localStorage.setItem("auth-user", JSON.stringify(user));
        } catch (error) {
            console.error("사용자 정보 새로고침 실패:", error);
            // 인증 오류시 로그아웃
            get().logout();
        }
    },

    // 로딩 상태 설정
    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },
}));