import { Router } from 'express';
import * as suporteController from './suporte.controller.js';
import { submitMessageSchema, updateMessageStatusSchema, bulkUpdateMessageStatusSchema } from './suporte.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

// Public routes
router.post('/', validate(submitMessageSchema), suporteController.submitMessage);

// Admin-only routes
router.get('/', authGuard, adminOnly, suporteController.getMessages);
router.patch('/:id/status', authGuard, adminOnly, validate(updateMessageStatusSchema), suporteController.updateMessageStatus);
router.patch('/:id/read', authGuard, adminOnly, suporteController.markMessageRead);
router.post('/bulk-status', authGuard, adminOnly, validate(bulkUpdateMessageStatusSchema), suporteController.bulkUpdateMessageStatus);
router.delete('/:id', authGuard, adminOnly, suporteController.deleteMessage);

export default router;
