import { Router } from 'express';
import { loanController } from '../controllers/loanController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All loan routes require authentication
router.use(authenticateToken);

// Create new loan
router.post('/', (req, res) => loanController.createLoan(req, res));

// Get all user's loans
router.get('/', (req, res) => loanController.getLoanApplications(req, res));

// Get specific loan
router.get('/:id', (req, res) => loanController.getLoanApplication(req, res));

// Update loan
router.put('/:id', (req, res) => loanController.updateLoan(req, res));

// Submit for review
router.post('/:id/submit', (req, res) => loanController.submitForReview(req, res));

// Get loan status
router.get('/:id/status', (req, res) => loanController.getLoanStatus(req, res));

// Get status history
router.get('/:id/history', (req, res) => loanController.getStatusHistory(req, res));

// Delete loan (draft only)
router.delete('/:id', (req, res) => loanController.deleteLoan(req, res));

export default router;
