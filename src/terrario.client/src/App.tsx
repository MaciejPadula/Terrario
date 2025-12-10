import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './shared/contexts/AuthContext';
import { MainLayout } from './shared/components/MainLayout';
import { LoginPage } from './features/auth/login/LoginPage';
import { RegisterPage } from './features/auth/register/RegisterPage';
import { AnimalListsPage } from './features/animal-lists/list/AnimalListsPage';
import { AnimalsPage } from './features/animals/list/AnimalsPage';
import { HomePage } from './features/home/HomePage';
import './App.css';

function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2d5016' }}>
        {title}
      </h2>
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
        <p style={{ color: '#888', fontSize: '1.125rem' }}>
          Ta funkcjonalność jest w trakcie rozwoju.
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/animals"
              element={
                <ProtectedRoute>
                  <AnimalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lists"
              element={
                <ProtectedRoute>
                  <AnimalListsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlaceholderPage title="Monitoring" icon="🌡️" />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlaceholderPage title="Harmonogram" icon="📅" />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlaceholderPage title="Statystyki" icon="📊" />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlaceholderPage title="Ustawienia" icon="⚙️" />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
