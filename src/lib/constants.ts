export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'] as const,
  MIN_DESCRIPTION_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TITLE_LENGTH: 100,
  MAX_TAGS: 10,
  MAX_PHOTOS_PER_UPLOAD: 5,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  PHOTOS: {
    LIST: '/photos',
    DETAIL: (id: string) => `/photos/${id}`,
    UPLOAD: '/photos',
    DELETE: (id: string) => `/photos/${id}`,
    UPDATE_VISIBILITY: (id: string) => `/photos/${id}/visibility`,
    LIKED: '/photos/liked',
    COMMENTS: (id: string) => `/photos/${id}/comments`,
  },
  LIKES: '/likes',
  COMMENTS: {
    DELETE: (id: string) => `/photos/comments/${id}`,
  },
  USERS: {
    PROFILE: (username: string) => `/users/${username}`,
    UPDATE_PROFILE: '/users/profile',
  },
} as const;

export const PHOTO_SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'views', label: '조회순' },
  { value: 'comments', label: '댓글순' },
] as const;

export const VIEW_MODES = [
  { value: 'grid', label: '그리드' },
  { value: 'list', label: '리스트' },
] as const;

export const PAGINATION = {
  PHOTOS_PER_PAGE: 12,
  COMMENTS_PER_PAGE: 10,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const GRID_COLUMNS = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
  LARGE: 4,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 자료를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
  INVALID_FILE_FORMAT: '지원하지 않는 파일 형식입니다.',
  FILE_TOO_LARGE: '파일 크기가 너무 큽니다.',
  DESCRIPTION_TOO_SHORT: `설명은 최소 ${UPLOAD_CONSTANTS.MIN_DESCRIPTION_LENGTH}자 이상 입력해주세요.`,
  TITLE_REQUIRED: '제목을 입력해주세요.',
} as const;

export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '사진이 성공적으로 업로드되었습니다.',
  UPDATE_SUCCESS: '변경사항이 저장되었습니다.',
  DELETE_SUCCESS: '삭제되었습니다.',
  LIKE_SUCCESS: '좋아요가 추가되었습니다.',
  UNLIKE_SUCCESS: '좋아요가 취소되었습니다.',
  COMMENT_SUCCESS: '댓글이 작성되었습니다.',
} as const;