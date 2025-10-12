/**
 * API endpoint paths and typed request/response interfaces
 */

// ============================================================================
// Endpoint Paths
// ============================================================================

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh-token',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
} as const;

// ============================================================================
// Request Types
// ============================================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface LogoutRequest {
    refresh_token: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    new_password: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        [key: string]: any;
    };
}

export interface RegisterResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        [key: string]: any;
    };
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token?: string;
}

export interface LogoutResponse {
    message: string;
    success: boolean;
}

export interface ForgotPasswordResponse {
    message: string;
    success: boolean;
}

export interface ResetPasswordResponse {
    message: string;
    success: boolean;
}

