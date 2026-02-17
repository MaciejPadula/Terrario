import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from './MainLayout';
import { Box, Spinner } from '@chakra-ui/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{props.children}</MainLayout>;
}
