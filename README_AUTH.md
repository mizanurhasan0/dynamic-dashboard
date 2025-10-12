# Authentication Module

A clean, modular, production-ready authentication module for React/Next.js applications with TypeScript. This module provides complete frontend authentication functionality with support for login, registration, password reset, and token refresh.

## Features

- ✅ Complete authentication flow (login, register, logout, forgot/reset password)
- ✅ Automatic token refresh on 401 errors
- ✅ Type-safe API calls with TypeScript
- ✅ React Query integration for efficient data fetching
- ✅ Configurable storage adapters (localStorage, sessionStorage, cookies, memory)
- ✅ In-memory access token storage (more secure)
- ✅ Request/response interceptors
- ✅ Clean error handling
- ✅ Modular and testable code
- ✅ CSS variables for dynamic theming
- ✅ SSR compatible (Next.js)

## Installation

```bash
npm install axios @tanstack/react-query
# or
yarn add axios @tanstack/react-query
```

## Quick Start

### 1. Wrap your app with providers

```tsx
// app/layout.tsx (Next.js) or main.tsx (React)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthProvider';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 2. Use the authentication hook

```tsx
// app/page.tsx
'use client';

import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <LoginForm onSuccess={() => console.log('Login successful!')} />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={() => logout.mutate()}>Logout</button>
    </div>
  );
}
```

### 3. Use individual form components

```tsx
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/Auth/ResetPasswordForm';

// Login
<LoginForm 
  onSuccess={() => router.push('/dashboard')}
  onForgotPassword={() => router.push('/forgot-password')}
/>

// Register
<RegisterForm onSuccess={() => router.push('/dashboard')} />

// Forgot Password
<ForgotPasswordForm 
  onSuccess={() => setShowSuccess(true)}
  onBackToLogin={() => router.push('/login')}
/>

// Reset Password (token from URL query param)
<ResetPasswordForm 
  token={searchParams.get('token') || ''}
  onSuccess={() => router.push('/login')}
/>
```

## API Reference

### `useAuth()` Hook

Main hook for authentication operations.

```tsx
const {
  // State
  user,              // User | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  
  // Mutations (React Query mutations)
  login,             // UseMutationResult<...>
  register,          // UseMutationResult<...>
  logout,            // UseMutationResult<...>
  forgotPassword,    // UseMutationResult<...>
  resetPassword,     // UseMutationResult<...>
} = useAuth();
```

#### Usage Examples

```tsx
// Login
login.mutate({ email: 'user@example.com', password: 'password' }, {
  onSuccess: (data) => console.log('Logged in:', data.user),
  onError: (error) => console.error('Login failed:', error.message),
});

// Register
register.mutate({ name: 'John Doe', email: 'john@example.com', password: 'password' });

// Logout
logout.mutate();

// Forgot Password
forgotPassword.mutate({ email: 'user@example.com' });

// Reset Password
resetPassword.mutate({ token: 'reset-token', new_password: 'newpassword' });
```

### Storage Adapters

By default, refresh tokens are stored in `localStorage`. You can switch to a different storage mechanism:

```tsx
// Use sessionStorage (cleared when browser closes)
import { setStorageAdapter, SessionStorageAdapter } from './utils/storage';
setStorageAdapter(new SessionStorageAdapter());

// Use cookies (better for SSR)
import { setStorageAdapter, CookieStorageAdapter } from './utils/storage';
setStorageAdapter(new CookieStorageAdapter());

// Use memory storage (for testing)
import { setStorageAdapter, MemoryStorageAdapter } from './utils/storage';
setStorageAdapter(new MemoryStorageAdapter());
```

**Important**: Call `setStorageAdapter()` before rendering your app.

```tsx
// app/layout.tsx (Next.js) - Early in your app
import { setStorageAdapter, CookieStorageAdapter } from './utils/storage';

// Set adapter before QueryClient creation
setStorageAdapter(new CookieStorageAdapter());

const queryClient = new QueryClient();
```

### Custom Storage Adapter

Create your own storage adapter for custom backends (e.g., secure native storage):

```tsx
import { StorageAdapter } from './utils/storage';

class SecureStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    // Your implementation
    return null;
  }
  
  setItem(key: string, value: string): void {
    // Your implementation
  }
  
  removeItem(key: string): void {
    // Your implementation
  }
  
  clear(): void {
    // Your implementation
  }
}

setStorageAdapter(new SecureStorageAdapter());
```

## Dynamic Theming

The module uses CSS variables for theming. You can change colors dynamically at runtime:

```tsx
// utils/theme.ts
export function setThemeColors(colors: {
  brand500?: string;
  brand600?: string;
  brand700?: string;
}) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  if (colors.brand500) root.style.setProperty('--brand-500', colors.brand500);
  if (colors.brand600) root.style.setProperty('--brand-600', colors.brand600);
  if (colors.brand700) root.style.setProperty('--brand-700', colors.brand700);
}

// Usage
setThemeColors({
  brand500: '#10b981', // Green theme
  brand600: '#059669',
  brand700: '#047857',
});
```

## Configuration

### Change Base URL

```tsx
// api/axios.ts (line 6)
const BASE_URL = 'https://your-api.com';
```

Or set it via environment variable:

```tsx
// api/axios.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://easy-com.work.gd';
```

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Add Dynamic Headers (for testing/dev)

```tsx
import { setDynamicHeaders, removeDynamicHeaders } from './api/axios';

// Add headers
setDynamicHeaders({
  'X-Custom-Header': 'value',
  'X-Debug': 'true',
});

// Remove headers
removeDynamicHeaders(['X-Custom-Header', 'X-Debug']);
```

## Token Refresh Flow

The module automatically handles token refresh on 401 errors:

1. Request fails with 401
2. Interceptor pauses all pending requests
3. Calls `/auth/refresh-token` with stored refresh token
4. Updates access token in memory
5. Retries original request with new token
6. Resumes all paused requests

If refresh fails:
- Clears all tokens
- Dispatches `auth:session-expired` event
- You can listen to this event to redirect to login

```tsx
// Listen for session expiry
useEffect(() => {
  const handleSessionExpired = () => {
    router.push('/login');
  };
  
  window.addEventListener('auth:session-expired', handleSessionExpired);
  
  return () => {
    window.removeEventListener('auth:session-expired', handleSessionExpired);
  };
}, [router]);
```

## Security Best Practices

### Recommended Setup

1. **Use httpOnly cookies for refresh tokens** (requires backend support)
   - Backend should set refresh token as httpOnly cookie
   - Frontend sends it automatically with requests
   - Not accessible via JavaScript (XSS protection)

2. **Store access tokens in memory** (already implemented)
   - Access tokens are kept in memory, not localStorage
   - Lost on page refresh (re-fetch using refresh token)
   - Better XSS protection

3. **Enable HTTPS in production**
   ```tsx
   // Ensure secure cookies in production
   const secure = window.location.protocol === 'https:';
   ```

4. **Set Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
   ```

5. **Use SameSite cookies**
   - Already set in `CookieStorageAdapter`
   - Protects against CSRF attacks

### Migration to httpOnly Cookies

If your backend supports httpOnly cookies:

1. Backend sets refresh token as httpOnly cookie via `Set-Cookie` header
2. Remove `refresh_token` from response body
3. Frontend automatically sends cookie with requests
4. Update logout to clear cookie via backend endpoint

```tsx
// Modified logout (backend clears cookie)
export async function logout(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>(ENDPOINTS.AUTH.LOGOUT);
  clearTokens(); // Only clears access token
  return response.data;
}
```

## Error Handling

All errors are typed as `APIError`:

```tsx
interface APIError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
```

Handle errors in your components:

```tsx
const { login } = useAuth();

if (login.isError) {
  console.error('Error:', login.error.message);
  console.error('Status:', login.error.status);
  console.error('Details:', login.error.details);
}
```

## Testing

The module is designed to be testable:

1. **Use `MemoryStorageAdapter` for tests**
   ```tsx
   import { setStorageAdapter, MemoryStorageAdapter } from './utils/storage';
   beforeEach(() => setStorageAdapter(new MemoryStorageAdapter()));
   ```

2. **Mock Axios**
   ```tsx
   import apiClient from './api/axios';
   jest.mock('./api/axios');
   ```

3. **Wrap tests with providers**
   ```tsx
   const wrapper = ({ children }) => (
     <QueryClientProvider client={queryClient}>
       <AuthProvider>{children}</AuthProvider>
     </QueryClientProvider>
   );
   
   renderHook(() => useAuth(), { wrapper });
   ```

## File Structure

```
/src
  /api
    axios.ts                    # Axios instance with interceptors
    endpoints.ts                # API endpoints and types
  /services
    auth.service.ts             # Low-level API calls
  /hooks
    useAuth.tsx                 # High-level auth hook (main hook)
    useProvideAuth.tsx          # Internal provider hook
  /contexts
    AuthProvider.tsx            # React context provider
  /components
    /Auth
      LoginForm.tsx             # Login form component
      RegisterForm.tsx          # Registration form
      ForgotPasswordForm.tsx    # Forgot password form
      ResetPasswordForm.tsx     # Reset password form
      AuthButton.tsx            # Reusable button component
  /utils
    storage.ts                  # Storage adapters
    types.ts                    # Shared types
  /styles
    global.css                  # CSS with variables for theming
```

## TypeScript Support

All APIs are fully typed. Import types as needed:

```tsx
import type { User, Tokens, APIError } from './utils/types';
import type { LoginRequest, LoginResponse } from './api/endpoints';
```

## Troubleshooting

### Tokens not persisting across page refresh

- Ensure `AuthProvider` is mounted before accessing `useAuth()`
- Check that storage adapter is working (check browser DevTools > Application > Storage)

### 401 errors not triggering refresh

- Verify refresh token exists in storage
- Check network tab for `/auth/refresh-token` calls
- Ensure backend returns correct response format

### CORS errors

- Configure backend to allow your frontend origin
- Include credentials in requests if using cookies:
  ```tsx
  apiClient.defaults.withCredentials = true;
  ```

## License

This module is provided as-is for use in your projects.

## Support

For issues or questions, check the code comments or refer to this README.

