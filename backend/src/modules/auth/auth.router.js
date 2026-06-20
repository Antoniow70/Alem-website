import { Router } from 'express';
import * as authController from './auth.controller.js';
import { loginSchema } from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authGuard, authController.logout);
router.get('/me', authGuard, authController.getMe);

export default router;
