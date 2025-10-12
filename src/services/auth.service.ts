/**
 * Authentication service - low-level API calls
 */

import apiClient, { setAccessToken, clearTokens } from '../api/axios';
import {
    ENDPOINTS,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    LogoutRequest,
    LogoutResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from '../api/endpoints';
import { storageAdapter } from '../utils/storage';
import { User, Tokens } from '../utils/types';

// ============================================================================
// Login
// ============================================================================

export async function login(credentials: LoginRequest): Promise<{ user: User; tokens: Tokens }> {
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    const { access_token, refresh_token, user } = response.data;

    // Store tokens
    setAccessToken(access_token);
    storageAdapter.setItem('refresh_token', refresh_token);

    return {
        user,
        tokens: {
            accessToken: access_token,
            refreshToken: refresh_token,
        },
    };
}

// ============================================================================
// Register
// ============================================================================

export async function register(data: RegisterRequest): Promise<{ user: User; tokens: Tokens }> {
    const response = await apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data);
    const { access_token, refresh_token, user } = response.data;

    // Store tokens
    setAccessToken(access_token);
    storageAdapter.setItem('refresh_token', refresh_token);

    return {
        user,
        tokens: {
            accessToken: access_token,
            refreshToken: refresh_token,
        },
    };
}

// ============================================================================
// Refresh Token
// ============================================================================

export async function refreshToken(refreshTokenValue: string): Promise<Tokens> {
    const response = await apiClient.post<RefreshTokenResponse>(ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refresh_token: refreshTokenValue,
    } as RefreshTokenRequest);

    const { access_token, refresh_token } = response.data;

    // Update tokens
    setAccessToken(access_token);
    if (refresh_token) {
        storageAdapter.setItem('refresh_token', refresh_token);
    }

    return {
        accessToken: access_token,
        refreshToken: refresh_token || refreshTokenValue,
    };
}

// ============================================================================
// Logout
// ============================================================================

export async function logout(): Promise<LogoutResponse> {
    const refreshTokenValue = storageAdapter.getItem('refresh_token');

    if (refreshTokenValue) {
        try {
            const response = await apiClient.post<LogoutResponse>(ENDPOINTS.AUTH.LOGOUT, {
                refresh_token: refreshTokenValue,
            } as LogoutRequest);

            // Clear tokens after successful logout
            clearTokens();

            return response.data;
        } catch (error) {
            // Clear tokens even if API call fails
            clearTokens();
            throw error;
        }
    }

    // Clear tokens if no refresh token found
    clearTokens();

    return {
        message: 'Logged out successfully',
        success: true,
    };
}

// ============================================================================
// Forgot Password
// ============================================================================

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
}

// ============================================================================
// Reset Password
// ============================================================================

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>(ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
}

// ============================================================================
// Get Current User (helper to extract user from token or make API call)
// ============================================================================

/**
 * Decode user info from JWT token (simple base64 decode)
 * Note: In production, backend should provide a /auth/me endpoint
 * This is a fallback for extracting user data from JWT
 */
export function getUserFromToken(token: string): User | null {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));

        // Extract user info (adjust based on your JWT structure)
        return {
            id: decoded.sub || decoded.id || decoded.user_id || '',
            email: decoded.email || '',
            name: decoded.name || '',
            ...decoded,
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

