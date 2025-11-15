import { Router } from 'express';
import { loanProgramController } from '../controllers/loanProgramController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Get all active loan programs
router.get('/', asyncHandler((req, res) => loanProgramController.getActiveLoanPrograms(req, res)));

// Get loan programs by category
router.get('/category', asyncHandler((req, res) => loanProgramController.getProgramsByCategory(req, res)));

// Get specific loan program
router.get('/:id', asyncHandler((req, res) => loanProgramController.getLoanProgram(req, res)));

// Get program statistics
router.get('/:id/stats', asyncHandler((req, res) => loanProgramController.getProgramStats(req, res)));

export default router;
