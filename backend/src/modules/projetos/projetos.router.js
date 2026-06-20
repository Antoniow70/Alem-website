import { Router } from 'express';
import * as projetosController from './projetos.controller.js';
import { createProjectSchema, updateProjectSchema, updateProjectStatusSchema } from './projetos.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

// Public routes
router.get('/pillars', projetosController.getPillars);
router.get('/activities', projetosController.getActivities);
router.get('/activities/all', projetosController.getAllActivities);
router.get('/', projetosController.getProjects);
router.get('/:id', projetosController.getProjectById);

// Admin-only routes
router.post('/', authGuard, adminOnly, validate(createProjectSchema), projetosController.createProject);
router.put('/:id', authGuard, adminOnly, validate(updateProjectSchema), projetosController.updateProject);
router.patch('/:id/status', authGuard, adminOnly, validate(updateProjectStatusSchema), projetosController.updateProjectStatus);
router.delete('/:id', authGuard, adminOnly, projetosController.deleteProject);

export default router;
