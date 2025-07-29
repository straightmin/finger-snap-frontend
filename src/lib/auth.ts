import { apiClient } from './api';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/auth';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

export const authApi = {
  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    // 토큰과 사용자 정보 저장
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    
    return response;
  },

  // 회원가입
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData);
    
    // 자동 로그인 처리
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    
    return response;
  },

  // 내 정보 조회
  async getMe(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // 로그아웃 API 실패해도 로컬 데이터는 삭제
      console.warn('로그아웃 API 요청 실패:', error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
};

export const tokenUtils = {
  // 토큰 가져오기
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // 사용자 정보 가져오기
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // 로그인 상태 확인
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // 토큰 유효성 검사 (간단한 JWT 버전)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // 데이터 지우기
  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};