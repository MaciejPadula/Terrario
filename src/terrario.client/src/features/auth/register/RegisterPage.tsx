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
  const { t } = useTranslation();

  const validate = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.invalidEmail');
    }

    if (!password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (password.length < 8) {
      newErrors.password = t('auth.passwordTooShort');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch');
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
        title: t('auth.registerSuccess'),
        description: `${t('auth.welcome')} ${t('messages.welcomeToTerrario')}, ${response.firstName || response.email}!`,
      });

      navigate('/');
    } catch (error) {
      const err = error as ErrorResponse;
      toaster.error({
        title: t('auth.registerError'),
        description: err.message || t('auth.accountCreationFailed'),
      });

      if (err.errors) {
        toaster.error({
          title: t('auth.errorDetails'),
          description: err.errors.join(', '),
        });
      }
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
        <Heading size="lg">{t('auth.registerTitle')}</Heading>

        <Field.Root invalid={!!errors.email} required>
          <Field.Label>{t('auth.email')}</Field.Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholders.email')}
          />
          {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
        </Field.Root>

        <Field.Root>
          <Field.Label>{t('auth.firstNameOptional')}</Field.Label>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('placeholders.firstName')}
          />
        </Field.Root>

        <Field.Root invalid={!!errors.password} required>
          <Field.Label>{t('auth.password')}</Field.Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('placeholders.password')}
          />
          {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword} required>
          <Field.Label>{t('auth.confirmPassword')}</Field.Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('placeholders.password')}
          />
          {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>}
        </Field.Root>

        <Button 
          type="submit" 
          bg="var(--color-primary)"
          color="var(--color-bg-primary)"
          _hover={{ bg: 'var(--color-primary-dark)' }}
          width="full" 
          loading={isLoading}
        >
          {t('auth.registerButton')}
        </Button>

        <Text>
          {t('auth.haveAccount')}{' '}
          <Link 
            color="var(--color-primary)" 
            _hover={{ color: 'var(--color-primary-light)' }}
            onClick={() => navigate('/login')}
          >
            {t('auth.loginLink')}
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
