// import { Router } from 'express';
// import {
//   registerController,
//   loginController,
//   refreshTokenController,
//   logoutController,
//   logoutAllController,
//   getMeController,
// } from '../controllers/authController';
// import { authenticateToken } from '../middleware/auth';
// import { validateSchema } from '../middleware/validation';
// import { loginSchema, registerSchema } from '../schemas/authSchemas';

// const router = Router();

// // Public routes
// router.post('/register', validateSchema(registerSchema), registerController);
// router.post('/login', validateSchema(loginSchema), loginController);
// router.post('/refresh-token', refreshTokenController);

// // Protected routes
// router.post('/logout', authenticateToken, logoutController);
// router.post('/logout-all', authenticateToken, logoutAllController);
// router.get('/me', authenticateToken, getMeController);

// export default router;

import { Router } from 'express';

import { registerController } from '@/controllers/authControllers';
import { validateSchema } from '@/middleware/validateSchema';

import { registerSchema } from '@/schemas/authSchemas';

export const authRouter: Router = Router();

authRouter.post(
  '/register',
  validateSchema(registerSchema),
  registerController
);
