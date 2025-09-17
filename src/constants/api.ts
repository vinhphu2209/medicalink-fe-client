export const API_ENDPOINTS = {
  AUTH: "/auth",
  ADMINS: "/admins",
  DOCTORS: "/doctors",
  SPECIALTIES: "/specialties",
  BLOGS: "/blogs",
  QUESTIONS: "/questions",
} as const;

export const REQUEST_TIMEOUT = 30000; // 30 seconds

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;
