'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    provider?: 'email' | 'google';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signUp: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) => Promise<void>;
    googleSignUp: (data: {
        email: string;
        firstName: string;
        lastName: string;
    }) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    // Simulate API calls - replace with actual authentication logic
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful login
            const mockUser: User = {
                id: '1',
                email,
                firstName: 'John',
                lastName: 'Doe',
                provider: 'email'
            };

            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        } catch (error) {
            throw new Error('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful signup
            const mockUser: User = {
                id: Date.now().toString(),
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                provider: 'email'
            };

            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        } catch (error) {
            throw new Error('Sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const googleSignUp = async (data: {
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful Google signup
            const mockUser: User = {
                id: Date.now().toString(),
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                provider: 'google'
            };

            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        } catch (error) {
            throw new Error('Google sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            // Check if user is stored in localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    };

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        signUp,
        googleSignUp,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
