import { Router } from 'express';
import { documentController } from '../controllers/documentController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Upload document for a loan
router.post(
  '/loans/:id/documents',
  authenticateToken,
  upload.single('file'),
  asyncHandler((req, res) => documentController.uploadDocument(req, res))
);

// List documents for a loan
router.get('/loans/:id/documents', authenticateToken, asyncHandler((req, res) => documentController.listDocuments(req, res)));

// Verify a document
router.post('/documents/:docId/verify', authenticateToken, asyncHandler((req, res) => documentController.verifyDocument(req, res)));

// Delete a document
router.delete('/documents/:docId', authenticateToken, asyncHandler((req, res) => documentController.deleteDocument(req, res)));

export default router;
