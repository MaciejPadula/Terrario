import { Route } from 'react-router-dom';
import { HomePage } from './HomePage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';

export function HomeRoutes() {
  return (
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />
  );
}
