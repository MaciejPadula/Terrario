// Shared types for authentication feature

export interface User {
  userId: string;
  email: string;
  firstName?: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  firstName?: string;
  token: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: string[];
}
