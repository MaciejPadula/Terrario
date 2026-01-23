import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './shared/contexts/AuthContext';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { AuthRoutes } from './features/auth/routes';
import { HomeRoutes } from './features/home/routes';
import { AnimalsRoutes } from './features/animals/routes';
import { AnimalListsRoutes } from './features/animal-lists/routes';
import { ScheduleRoutes } from './features/schedule/routes';
import './App.css';
import { t } from 'i18next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>
        {title}
      </h2>
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '16px', 
        boxShadow: 'var(--box-shadow-light)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '1.125rem' }}>
          {t('placeholder.underDevelopment')}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {AuthRoutes()}
            {HomeRoutes()}
            {AnimalsRoutes()}
            {AnimalListsRoutes()}
            {ScheduleRoutes()}
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title={t('pages.monitoring')} icon="🌡️" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title={t('pages.statistics')} icon="📊" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title={t('pages.settings')} icon="⚙️" />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
