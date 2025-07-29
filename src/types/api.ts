export interface ApiResponse<T = any> {
  data?: T;
  message: string;
  statusCode?: number;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}