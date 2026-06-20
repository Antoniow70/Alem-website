import { Router } from 'express';
import * as voluntariosController from './voluntarios.controller.js';
import { submitVolunteerSchema, updateVolunteerStatusSchema, bulkUpdateVolunteerStatusSchema } from './voluntarios.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

// Public routes
router.get('/', voluntariosController.getVolunteers);
router.post('/', validate(submitVolunteerSchema), voluntariosController.submitVolunteer);

// Admin-only routes
router.patch('/:id/status', authGuard, adminOnly, validate(updateVolunteerStatusSchema), voluntariosController.updateVolunteerStatus);
router.patch('/:id/read', authGuard, adminOnly, voluntariosController.markVolunteerRead);
router.post('/bulk-status', authGuard, adminOnly, validate(bulkUpdateVolunteerStatusSchema), voluntariosController.bulkUpdateVolunteerStatus);
router.delete('/:id', authGuard, adminOnly, voluntariosController.deleteVolunteer);

export default router;
