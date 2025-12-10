import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './shared/contexts/AuthContext';
import { MainLayout } from './shared/components/MainLayout';
import { LoginPage } from './features/auth/login/LoginPage';
import { RegisterPage } from './features/auth/register/RegisterPage';
import './App.css';

function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2d5016' }}>
        Dashboard
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Card 1 */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #8bc34a'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🦎</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Zwierzęta</h3>
          <p style={{ color: '#666', fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Aktywnych w kolekcji</p>
        </div>

        {/* Card 2 */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #4caf50'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Temperatura</h3>
          <p style={{ color: '#666', fontSize: '2rem', fontWeight: 'bold' }}>25°C</p>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Średnia w terrariach</p>
        </div>

        {/* Card 3 */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #66bb6a'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Zadania</h3>
          <p style={{ color: '#666', fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Do wykonania dziś</p>
        </div>

        {/* Card 4 */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #81c784'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Wilgotność</h3>
          <p style={{ color: '#666', fontSize: '2rem', fontWeight: 'bold' }}>65%</p>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Średnia w terrariach</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2d5016' }}>
          Ostatnia aktywność
        </h2>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }}>
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            Brak aktywności do wyświetlenia
          </p>
        </div>
      </div>
    </div>
  );
}

function AnimalsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2d5016' }}>
        Moje Zwierzęta
      </h2>
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🦎</div>
        <p style={{ color: '#888', fontSize: '1.125rem' }}>
          Nie masz jeszcze żadnych zwierząt w swojej kolekcji.
        </p>
        <button style={{
          marginTop: '1.5rem',
          padding: '0.75rem 2rem',
          background: '#8bc34a',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          + Dodaj pierwsze zwierzę
        </button>
      </div>
    </div>
  );
}

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
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/animals"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AnimalsPage />
                  </MainLayout>
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
