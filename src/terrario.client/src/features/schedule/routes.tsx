import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { SchedulePage } from './SchedulePage';

export function ScheduleRoutes() {
  return (
    <Route
      path="/schedule"
      element={
        <ProtectedRoute>
          <SchedulePage />
        </ProtectedRoute>
      }
    />
  );
}
