import { Router } from 'express';
import authRoutes from './authRoutes';
import loanRoutes from './loanRoutes';
import documentRoutes from './documentRoutes';

const router = Router();

// Mount auth routes at /api/auth
router.use('/auth', authRoutes);

// Mount loan routes at /api/loans
router.use('/loans', loanRoutes);

// Mount document routes (includes /loans/:id/documents and /documents/:docId)
router.use('/', documentRoutes);

export default router;
