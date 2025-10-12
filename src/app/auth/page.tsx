'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Login } from '@/components/auth/Login';
import { SignUp } from '@/components/auth/SignUp';
import { GoogleSignUp } from '@/components/auth/GoogleSignUp';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'google-signup';

export default function AuthPage() {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [googleUser, setGoogleUser] = useState<any>(null);
    const { login, signUp, googleSignUp, isLoading } = useAuth();
    const router = useRouter();

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await login(data.email, data.password);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            // Handle error (show toast, etc.)
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
            await signUp({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign up error:', error);
            // Handle error (show toast, etc.)
        }
    };

    const handleGoogleSignUp = async (data: {
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        try {
            await googleSignUp(data);
            router.push('/dashboard');
        } catch (error) {
            console.error('Google sign up error:', error);
            // Handle error (show toast, etc.)
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                    <p className="mt-4 text-[var(--color-textSecondary)]">Loading...</p>
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
