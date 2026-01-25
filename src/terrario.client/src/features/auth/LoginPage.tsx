import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { ErrorResponse, LoginRequest } from './shared/types';
import { apiClient } from '../../shared/api/client';
import { toaster } from '../../shared/toaster';
import { useAuth } from '../../shared/hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.invalidEmail');
    }

    if (!password) {
      newErrors.password = t('auth.passwordRequired');
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
        title: t('auth.loginSuccess'),
        description: `${t('auth.welcome')}, ${response.firstName || response.email}!`,
      });

      navigate('/');
    } catch (error) {
      const err = error as ErrorResponse;
      toaster.error({
        title: t('auth.loginError'),
        description: err.message || t('auth.invalidCredentials'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      maxW="md" 
      mx="auto" 
      mt={8} 
      p={6} 
      borderWidth={1} 
      borderRadius="lg" 
      boxShadow="var(--box-shadow-light)"
      borderColor="var(--color-border-light)"
      bg="var(--color-bg-primary)"
    >
      <Stack gap={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">{t('auth.loginTitle')}</Heading>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>{t('auth.email')}</Field.Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholders.email')}
          />
          {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>{t('auth.password')}</Field.Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('placeholders.password')}
          />
          {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
        </Field.Root>

        <Button
          type="submit"
          bg="var(--color-primary)"
          color="var(--color-bg-primary)"
          _hover={{ bg: 'var(--color-primary-dark)' }}
          width="full"
          loading={isLoading}
        >
          {t('auth.loginButton')}
        </Button>

        <Text>
          {t('auth.noAccount')}{' '}
          <Link 
            color="var(--color-primary)" 
            _hover={{ color: 'var(--color-primary-light)' }}
            onClick={() => navigate('/register')}
          >
            {t('auth.registerLink')}
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
