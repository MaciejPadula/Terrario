import { Route } from 'react-router-dom';
import { AnimalListsPage } from './list/AnimalListsPage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';

export function AnimalListsRoutes() {
  return (
    <Route
      path="/lists"
      element={
        <ProtectedRoute>
          <AnimalListsPage />
        </ProtectedRoute>
      }
    />
  );
}
