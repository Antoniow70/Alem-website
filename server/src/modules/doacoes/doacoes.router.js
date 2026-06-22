import { Router } from 'express';
import * as doacoesController from './doacoes.controller.js';
import { submitDonationSchema, updateDonationStatusSchema } from './doacoes.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

// Public routes
router.post('/', validate(submitDonationSchema), doacoesController.submitDonation);

// Admin-only routes
router.get('/', authGuard, adminOnly, doacoesController.getDonations);
router.get('/total', authGuard, adminOnly, doacoesController.getDonationsTotalByPeriod);
router.patch('/:id/status', authGuard, adminOnly, validate(updateDonationStatusSchema), doacoesController.updateDonationStatus);
router.delete('/:id', authGuard, adminOnly, doacoesController.deleteDonation);

export default router;
