import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  Link,
  Field,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared/api/client';
import { useAuth } from '../../../shared/contexts/AuthContext';
import type { LoginRequest, ErrorResponse } from '../shared/types';
import { toaster } from '../../../shared/toaster';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!password) {
      newErrors.password = 'Hasło jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const loginData: LoginRequest = { email, password };
      const response = await apiClient.login(loginData);
      
      login(response);
      
      toaster.success({
        title: 'Zalogowano pomyślnie',
        description: `Witaj, ${response.firstName || response.email}!`,
      });

      navigate('/');
    } catch (error) {
      const err = error as ErrorResponse;
      toaster.error({
        title: 'Błąd logowania',
        description: err.message || 'Nieprawidłowy email lub hasło',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Stack gap={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Logowanie</Heading>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.com"
          />
          {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Hasło</Field.Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
        </Field.Root>

        <Button
          type="submit"
          colorPalette="blue"
          width="full"
          loading={isLoading}
        >
          Zaloguj się
        </Button>

        <Text>
          Nie masz konta?{' '}
          <Link color="blue.500" onClick={() => navigate('/register')}>
            Zarejestruj się
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
