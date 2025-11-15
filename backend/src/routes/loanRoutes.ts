import { Router } from 'express';
import { loanController } from '../controllers/loanController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All loan routes require authentication
router.use(authenticateToken);

// Create new loan
router.post('/', asyncHandler((req, res) => loanController.createLoan(req, res)));

// Get all user's loans
router.get('/', asyncHandler((req, res) => loanController.getLoanApplications(req, res)));

// Get specific loan
router.get('/:id', asyncHandler((req, res) => loanController.getLoanApplication(req, res)));

// Update loan
router.put('/:id', asyncHandler((req, res) => loanController.updateLoan(req, res)));

// Submit for review
router.post('/:id/submit', asyncHandler((req, res) => loanController.submitForReview(req, res)));

// Get loan status
router.get('/:id/status', asyncHandler((req, res) => loanController.getLoanStatus(req, res)));

// Get status history
router.get('/:id/history', asyncHandler((req, res) => loanController.getStatusHistory(req, res)));

// Delete loan (draft only)
router.delete('/:id', asyncHandler((req, res) => loanController.deleteLoan(req, res)));

export default router;
