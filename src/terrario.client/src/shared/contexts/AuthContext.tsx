import { createContext, useState, type ReactNode } from 'react';
import type { User, AuthResponse } from '../../features/auth/shared/types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };
export type { AuthContextType };

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (authData: AuthResponse) => {
    const userData: User = {
      userId: authData.userId,
      email: authData.email,
      firstName: authData.firstName,
    };

    setUser(userData);
    setToken(authData.token);

    // Persist to localStorage
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // Even if the API call fails, we still want to clear local state
      console.warn('Logout API call failed, clearing local state anyway');
    }
    
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
