import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

// Mount auth routes at /api/auth
router.use('/auth', authRoutes);

// Future routes will be added here:
// router.use('/loans', loanRoutes);
// router.use('/documents', documentRoutes);
// etc.

export default router;
