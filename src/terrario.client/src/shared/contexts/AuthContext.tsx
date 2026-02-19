import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, AuthResponse } from '../../features/auth/shared/types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };
export type { AuthContextType };

export function AuthProvider(props: { children: ReactNode }) {
  const navigate = useNavigate();
  
  // Initialize state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate token on mount by calling backend
  useEffect(() => {
    const validateStoredToken = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Validate with backend to ensure token is still valid
      try {
        const response = await apiClient.validateToken();
        
        if (response.isValid) {
          // Update user data from backend response
          const userData: User = {
            userId: response.userId,
            email: response.email,
            firstName: response.firstName,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.warn('Token validation failed on backend');
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login page using React Router
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.warn('Token validation request failed, clearing session', error);
        
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page using React Router
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    validateStoredToken();
  }, [navigate]); // Run only once on mount

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
    isLoading,
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
