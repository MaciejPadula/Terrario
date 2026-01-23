import { Route } from 'react-router-dom';
import { AnimalsPage } from './list/AnimalsPage';
import { AnimalDetailsPage } from './details/AnimalDetailsPage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';

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
