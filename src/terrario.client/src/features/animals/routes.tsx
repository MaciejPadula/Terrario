import { Route } from 'react-router-dom';
import { AnimalsPage } from './AnimalsPage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { AnimalDetailsPage } from './AnimalDetailsPage';

export function AnimalsRoutes() {
  return (
    <>
      <Route
        path="/animals"
        element={
          <ProtectedRoute>
            <AnimalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/animals/:id"
        element={
          <ProtectedRoute>
            <AnimalDetailsPage />
          </ProtectedRoute>
        }
      />
    </>
  );
}
