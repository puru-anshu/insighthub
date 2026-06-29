import { type ReactNode } from 'react';

import { useAuthStore } from './auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps the app and provides authentication context.
 * Uses Zustand store for state management with localStorage persistence.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Future: check token validity on mount, refresh if needed
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // useEffect(() => { validateToken(); }, []);

  return <>{children}</>;
}

export function checkIsAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}
