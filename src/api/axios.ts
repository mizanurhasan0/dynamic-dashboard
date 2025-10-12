import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { storageAdapter } from '../utils/storage';
import { APIError } from '../utils/types';
import { ENDPOINTS } from './endpoints';

// Base URL for all API requests
// Falls back to a local development server if not configured
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// In-memory access token storage (more secure than localStorage for access tokens)
let accessToken: string | null = null;

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
    refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers when refresh completes
 */
function onTokenRefreshed(token: string): void {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
    return accessToken;
}

/**
 * Set access token in memory
 */
export function setAccessToken(token: string | null): void {
    accessToken = token;
}

/**
 * Clear all auth tokens
 */
export function clearTokens(): void {
    accessToken = null;
    storageAdapter.removeItem('refresh_token');
}

/**
 * Shared Axios instance with interceptors
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

/**
 * Request interceptor to attach access token
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle 401 errors and refresh tokens
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors by attempting token refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for the ongoing refresh to complete
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = storageAdapter.getItem('refresh_token');
                if (!refreshToken) throw new Error('No refresh token available');

                // Attempt to refresh the token
                const response = await apiClient.post(
                    ENDPOINTS.AUTH.REFRESH_TOKEN,
                    { refresh_token: refreshToken }
                );

                const { access_token, refresh_token: newRefreshToken } = response.data;

                // Update tokens
                setAccessToken(access_token);
                if (newRefreshToken) {
                    storageAdapter.setItem('refresh_token', newRefreshToken);
                }

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }

                // Notify all waiting requests
                onTokenRefreshed(access_token);
                isRefreshing = false;

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear auth state
                isRefreshing = false;
                refreshSubscribers = [];
                clearTokens();

                // Emit custom event for auth failure (allows app to react)
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:session-expired'));
                }

                return Promise.reject(refreshError);
            }
        }

        // Transform error to APIError format
        const apiError: APIError = {
            message: error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
                ? (error.response.data.message as string)
                : (typeof error.message === 'string' ? error.message : 'An error occurred'),
            status: error.response?.status,
            code: error.code,
            details: error.response?.data,
        };

        return Promise.reject(apiError);
    }
);

/**
 * Inject dynamic headers (useful for testing/development)
 */
export function setDynamicHeaders(headers: Record<string, string>): void {
    Object.entries(headers).forEach(([key, value]) => {
        apiClient.defaults.headers.common[key] = value;
    });
}

/**
 * Remove dynamic headers
 */
export function removeDynamicHeaders(keys: string[]): void {
    keys.forEach((key) => delete apiClient.defaults.headers.common[key]);
}

export default apiClient;

