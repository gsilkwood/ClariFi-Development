import { Router } from 'express';
import authRoutes from './authRoutes';
import loanRoutes from './loanRoutes';

const router = Router();

// Mount auth routes at /api/auth
router.use('/auth', authRoutes);

// Mount loan routes at /api/loans
router.use('/loans', loanRoutes);

// Future routes will be added here:
// router.use('/documents', documentRoutes);
// etc.

export default router;
