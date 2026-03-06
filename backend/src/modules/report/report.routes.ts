import { Router } from 'express';

import { authMiddleware } from '@middlewares/auth.middleware';
import { requireRole } from '@middlewares/role.middleware';
import { uploadReportImages } from '@middlewares/upload.middleware';

// Controller
import {
  createReport,
  getAllReports,
  getReportById,
  deleteReportById,
  updateReportStatus,
} from './report.controller';

const router = Router();

router.post(
  '/create',
  authMiddleware,
  requireRole('super_user', 'standard_user'),
  uploadReportImages.array('attachments', 5),
  createReport
);

router.get(
  '/all',
  authMiddleware,
  requireRole('super_user', 'standard_user', 'service_desk_user'),
  getAllReports
);

// Get by id
router.get(
  '/:id',
  authMiddleware,
  requireRole('super_user', 'standard_user', 'service_desk_user'),
  getReportById
);

router.delete(
  '/delete/:id',
  authMiddleware,
  requireRole('super_user'),
  deleteReportById
);

router.patch(
  '/update-status/:id',
  authMiddleware,
  requireRole('super_user'),
  updateReportStatus
);

export default router;
