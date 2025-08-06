import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be less than 64 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters')
      .max(64, 'Confirm password must be less than 64 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
