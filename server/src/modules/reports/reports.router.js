import { Router } from 'express';
import * as reportsController from './reports.controller.js';
import { getReportSchema } from './reports.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.get('/', authGuard, adminOnly, validate(getReportSchema), reportsController.getConsolidatedReport);

export default router;
