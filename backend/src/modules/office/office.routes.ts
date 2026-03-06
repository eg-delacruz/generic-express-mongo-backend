import { Router } from 'express';

import {
  createOffice,
  getAllOffices,
  deleteOffice,
} from '@modules/office/office.controller';

import { authMiddleware } from '@middlewares/auth.middleware';
import { requireRole } from '@middlewares/role.middleware';

const router = Router();

router.post('/create', authMiddleware, requireRole('super_user'), createOffice);

// Get all offices
router.get(
  '/',
  authMiddleware,
  requireRole('super_user', 'service_desk_user', 'standard_user'),
  getAllOffices
);

// Delete office by ID
router.delete(
  '/delete/:id',
  authMiddleware,
  requireRole('super_user'),
  deleteOffice
);

export default router;
