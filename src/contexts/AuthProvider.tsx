/**
 * Auth Context Provider
 * Wraps the app to provide auth state to all components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useProvideAuth, UseProvideAuthReturn } from '../hooks/useProvideAuth';

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<UseProvideAuthReturn | undefined>(undefined);

// ============================================================================
// Provider Props
// ============================================================================

interface AuthProviderProps {
    children: ReactNode;
}

// ============================================================================
// Provider Component
// ============================================================================

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const auth = useProvideAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Context Hook
// ============================================================================

/**
 * Access auth context (internal use)
 * For external use, prefer the useAuth hook from hooks/useAuth.tsx
 */
export function useAuthContext(): UseProvideAuthReturn {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

