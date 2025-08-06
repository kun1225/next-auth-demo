import type { User } from './user';

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = RegisterRequest

export type LoginResponse = RegisterResponse