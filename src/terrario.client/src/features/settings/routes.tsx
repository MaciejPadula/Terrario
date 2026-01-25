import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import { SettingsPage } from "./SettingsPage";

export function SettingsRoutes() {
  return (
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      }
    />
  );
}