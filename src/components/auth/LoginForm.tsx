/**
 * Login form component
 */

import React, { FormEvent, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from './AuthButton';

// ============================================================================
// Props
// ============================================================================

interface LoginFormProps {
    onSuccess?: () => void;
    onForgotPassword?: () => void;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function LoginForm({
    onSuccess,
    onForgotPassword,
    className = '',
}: LoginFormProps): JSX.Element {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!email || !password) {
                return;
            }

            login.mutate(
                { email, password },
                {
                    onSuccess: () => {
                        onSuccess?.();
                    },
                }
            );
        },
        [email, password, login, onSuccess]
    );

    return (
        <form
            className={`auth-form ${className}`}
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="auth-form__header">
                <h2 className="auth-form__title">Sign In</h2>
                <p className="auth-form__subtitle">Welcome back! Please enter your details.</p>
            </div>

            {login.isError && (
                <div className="auth-form__error">
                    {login.error?.message || 'Login failed. Please try again.'}
                </div>
            )}

            <div className="auth-form__fields">
                <div className="auth-form__field">
                    <label htmlFor="email" className="auth-form__label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="auth-form__input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        disabled={login.isPending}
                    />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="password" className="auth-form__label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="auth-form__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        disabled={login.isPending}
                    />
                </div>
            </div>

            {onForgotPassword && (
                <div className="auth-form__link-wrapper">
                    <button
                        type="button"
                        className="auth-form__link"
                        onClick={onForgotPassword}
                        disabled={login.isPending}
                    >
                        Forgot password?
                    </button>
                </div>
            )}

            <AuthButton
                type="submit"
                fullWidth
                isLoading={login.isPending}
                disabled={!email || !password}
            >
                Sign In
            </AuthButton>
        </form>
    );
}

