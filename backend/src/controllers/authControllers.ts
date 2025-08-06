import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { db } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function registerController(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await db('users').where('email', email).first();
}
