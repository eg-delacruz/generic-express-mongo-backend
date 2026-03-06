import { Router } from 'express';

import authRoutes from '@modules/auth/auth.routes';
import officeRoutes from '@modules/office/office.routes';
import userRoutes from '@modules/user/user.routes';
import reportRoutes from '@modules/report/report.routes';

export const router = Router();

// // Mount module routes
router.use('/auth', authRoutes);
router.use('/offices', officeRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

// Test route to verify server is working
router.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});
