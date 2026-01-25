import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { t } from "i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AnimalListsRoutes } from "./features/animal-lists/routes";
import { AnimalsRoutes } from "./features/animals/routes";
import { AuthRoutes } from "./features/auth/routes";
import { HomeRoutes } from "./features/home/routes";
import { ScheduleRoutes } from "./features/schedule/routes";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { AuthProvider } from "./shared/contexts/AuthContext";
import { PushNotificationProvider } from "./shared/contexts/PushNotificationProvider";
import { PlaceholderPage } from "./PlaceholderPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PushNotificationProvider>
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
                      <PlaceholderPage
                        title={t("pages.monitoring")}
                        icon="🌡️"
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <ProtectedRoute>
                      <PlaceholderPage
                        title={t("pages.statistics")}
                        icon="📊"
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <PlaceholderPage title={t("pages.settings")} icon="⚙️" />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </PushNotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
