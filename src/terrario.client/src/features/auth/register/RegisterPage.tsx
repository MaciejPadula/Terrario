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
import type { RegisterRequest, ErrorResponse } from '../shared/types';
import { toaster } from '../../../shared/toaster';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Potwierdzenie hasła jest wymagane';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
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
      const registerData: RegisterRequest = {
        email,
        password,
        confirmPassword,
        firstName: firstName || undefined,
      };
      const response = await apiClient.register(registerData);

      login(response);

      toaster.success({
        title: 'Rejestracja pomyślna',
        description: `Witaj w Terrario, ${response.firstName || response.email}!`,
      });

      navigate('/');
    } catch (error) {
      const err = error as ErrorResponse;
      toaster.error({
        title: 'Błąd rejestracji',
        description: err.message || 'Nie udało się utworzyć konta',
      });

      if (err.errors) {
        toaster.error({
          title: 'Szczegóły błędów',
          description: err.errors.join(', '),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Stack gap={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Rejestracja</Heading>

        <Field.Root invalid={!!errors.email} required>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.com"
          />
          {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Imię (opcjonalne)</Field.Label>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jan"
          />
        </Field.Root>

        <Field.Root invalid={!!errors.password} required>
          <Field.Label>Hasło</Field.Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword} required>
          <Field.Label>Potwierdź hasło</Field.Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>}
        </Field.Root>

        <Button type="submit" colorPalette="blue" width="full" loading={isLoading}>
          Zarejestruj się
        </Button>

        <Text>
          Masz już konto?{' '}
          <Link color="blue.500" onClick={() => navigate('/login')}>
            Zaloguj się
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
