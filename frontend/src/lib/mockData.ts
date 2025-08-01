import type { User } from '@/types/user';

export const users: User[] = [
  {
    id: 1,
    name: 'test',
    email: 'test@example.com',
    password: '123456',
    role: 'admin',
  },
  {
    id: 2,
    name: 'user',
    email: 'user@example.com',
    password: '123456',
    role: 'user',
  },
];
