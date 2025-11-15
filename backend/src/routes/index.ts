import { Router } from 'express';
import authRoutes from './authRoutes';
import loanRoutes from './loanRoutes';
import loanProgramRoutes from './loanProgramRoutes';
import documentRoutes from './documentRoutes';
import notificationRoutes from './notificationRoutes';
import activityRoutes from './activityRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

// Mount auth routes at /api/auth
router.use('/auth', authRoutes);

// Mount loan program routes at /api/programs
router.use('/programs', loanProgramRoutes);

// Mount loan routes at /api/loans
router.use('/loans', loanRoutes);

// Mount notification routes at /api/notifications
router.use('/notifications', notificationRoutes);

// Mount activity routes at /api/activities
router.use('/activities', activityRoutes);

// Mount task routes at /api/tasks
router.use('/tasks', taskRoutes);

// Mount document routes (includes /loans/:id/documents and /documents/:docId)
router.use('/', documentRoutes);

export default router;
