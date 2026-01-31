import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from './MainLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{props.children}</MainLayout>;
}
