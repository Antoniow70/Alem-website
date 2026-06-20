import { Router } from 'express';
import * as equipaController from './equipa.controller.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from './equipa.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.get('/', equipaController.getTeam);
router.post('/', authGuard, adminOnly, validate(createTeamMemberSchema), equipaController.createTeamMember);
router.put('/:id', authGuard, adminOnly, validate(updateTeamMemberSchema), equipaController.updateTeamMember);
router.delete('/:id', authGuard, adminOnly, equipaController.deleteTeamMember);

export default router;
