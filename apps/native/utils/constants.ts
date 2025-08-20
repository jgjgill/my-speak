/**
 * Application Constants
 *
 * This file centralizes all constants used across the application.
 * Import from this file instead of defining constants in individual files.
 */

// Authentication Constants
export const TOKEN_KEY_NAME = "accessToken";
export const COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const COOKIE_MAX_AGE = 20; // 20 seconds
export const JWT_EXPIRATION_TIME = "20s"; // 20 seconds
export const REFRESH_TOKEN_EXPIRY = "30d"; // 30 days
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Refresh Token Constants
export const REFRESH_BEFORE_EXPIRY_SEC = 60; // Refresh token 1 minute before expiry

// Google OAuth Constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/callback`;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Apple OAuth Constants
export const APPLE_CLIENT_ID_WEB = process.env.APPLE_CLIENT_ID_WEB!;
export const APPLE_CLIENT_SECRET_WEB = process.env.APPLE_CLIENT_SECRET_WEB!;
export const APPLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/apple/callback`;
export const APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize";

// Environment Constants
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; // 네이티브 앱 API 서버
export const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL; // 웹뷰용 웹 앱 URL
export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME;
export const JWT_SECRET = process.env.JWT_SECRET!;

// Cookie Settings
export const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: "Lax" as const,
	path: "/",
	maxAge: COOKIE_MAX_AGE,
};

export const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: "Lax" as const,
	path: "/api/auth/refresh", // Restrict to refresh endpoint only
	maxAge: REFRESH_TOKEN_MAX_AGE,
};
