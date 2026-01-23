import { Route } from 'react-router-dom';
import { LoginPage } from './login/LoginPage';
import { RegisterPage } from './register/RegisterPage';

export function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </>
  );
}
