import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { AssistantPage } from './AssistantPage';

export function AiRoutes() {
  return (
    <Route
      path="/assistant"
      element={
        <ProtectedRoute>
          <AssistantPage />
        </ProtectedRoute>
      }
    />
  );
}
