export interface User {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
}