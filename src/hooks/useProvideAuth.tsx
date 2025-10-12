/**
 * Internal provider hook for auth state management
 * This hook contains the core auth logic used by AuthProvider
 */

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../utils/types';
import { getAccessToken } from '../api/axios';
import { storageAdapter } from '../utils/storage';
import { getUserFromToken } from '../services/auth.service';

export interface UseProvideAuthReturn extends AuthState {
    setUser: (user: User | null) => void;
    setIsLoading: (loading: boolean) => void;
    initializeAuth: () => void;
}

/**
 * Internal hook for managing auth state
 */
export function useProvideAuth(): UseProvideAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Initialize auth state from stored tokens
     */
    const initializeAuth = useCallback(() => {
        const token = getAccessToken();
        const refreshToken = storageAdapter.getItem('refresh_token');

        if (token && refreshToken) {
            // Try to extract user from token
            const userData = getUserFromToken(token);
            if (userData) {
                setUser(userData);
            }
        }

        setIsLoading(false);
    }, []);

    /**
     * Listen for auth session expiry events
     */
    useEffect(() => {
        const handleSessionExpired = () => {
            setUser(null);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:session-expired', handleSessionExpired);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('auth:session-expired', handleSessionExpired);
            }
        };
    }, []);

    /**
     * Initialize auth on mount
     */
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        setIsLoading,
        initializeAuth,
    };
}

