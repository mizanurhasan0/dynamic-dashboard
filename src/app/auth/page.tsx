'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Login } from '@/components/auth/Login';
import { SignUp } from '@/components/auth/SignUp';
import { GoogleSignUp } from '@/components/auth/GoogleSignUp';
import { useAuth } from '@/hooks/useAuth';

type AuthMode = 'login' | 'signup' | 'google-signup';

export default function AuthPage() {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [googleUser, setGoogleUser] = useState<any>(null);
    const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('User authenticated, redirecting to dashboard:', { user, isAuthenticated });
            // Use replace to prevent back button issues
            router.replace('/dashboard');
        }
    }, [isAuthenticated, user, router]);

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await login.mutateAsync({
                email: data.email,
                password: data.password,
            });
            // Redirect will be handled by the useEffect when user state updates
        } catch (error) {
            console.error('Login error:', error);
            // Error handling is done in the mutation callbacks
            // You can add toast notifications here
        }
    };

    const handleSignUp = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {
        try {
            // Combine firstName and lastName into name for the API
            const name = `${data.firstName} ${data.lastName}`.trim();

            await register.mutateAsync({
                email: data.email,
                password: data.password,
                name: name,
            });
            // Redirect will be handled by the useEffect when user state updates
        } catch (error) {
            console.error('Sign up error:', error);
            // Error handling is done in the mutation callbacks
            // You can add toast notifications here
        }
    };

    const handleGoogleSignUp = async (data: {
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        try {
            // Google signup uses the same register endpoint
            const name = `${data.firstName} ${data.lastName}`.trim();

            await register.mutateAsync({
                email: data.email,
                password: '', // Google auth might not need a password, adjust based on your API
                name: name,
            });
            // Redirect will be handled by the useEffect when user state updates
        } catch (error) {
            console.error('Google sign up error:', error);
            // Error handling is done in the mutation callbacks
            // You can add toast notifications here
        }
    };

    const handleGoogleAuth = () => {
        // Simulate Google OAuth flow
        // In a real app, this would integrate with Google OAuth
        const mockGoogleUser = {
            email: 'user@gmail.com',
            name: 'John Doe',
            picture: 'https://via.placeholder.com/150'
        };

        setGoogleUser(mockGoogleUser);
        setAuthMode('google-signup');
    };

    // Show loading state for auth operations
    if (isLoading || login.isPending || register.isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                    <p className="mt-4 text-[var(--color-textSecondary)]">
                        {login.isPending && 'Logging in...'}
                        {register.isPending && 'Creating account...'}
                        {isLoading && !login.isPending && !register.isPending && 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
            <div className="w-full max-w-md">
                {authMode === 'login' && (
                    <Login
                        onSwitchToSignUp={() => setAuthMode('signup')}
                        onSwitchToGoogleSignUp={handleGoogleAuth}
                        onLogin={handleLogin}
                    />
                )}

                {authMode === 'signup' && (
                    <SignUp
                        onSwitchToLogin={() => setAuthMode('login')}
                        onSwitchToGoogleSignUp={handleGoogleAuth}
                        onSignUp={handleSignUp}
                    />
                )}

                {authMode === 'google-signup' && (
                    <GoogleSignUp
                        onSwitchToLogin={() => setAuthMode('login')}
                        onSwitchToSignUp={() => setAuthMode('signup')}
                        onGoogleSignUp={handleGoogleSignUp}
                        googleUser={googleUser}
                    />
                )}
            </div>
        </div>
    );
}
