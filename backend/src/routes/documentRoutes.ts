import { Router } from 'express';
import { documentController } from '../controllers/documentController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Upload document for a loan
router.post(
  '/loans/:id/documents',
  authenticateToken,
  upload.single('file'),
  documentController.uploadDocument
);

// List documents for a loan
router.get('/loans/:id/documents', authenticateToken, documentController.listDocuments);

// Verify a document
router.post('/documents/:docId/verify', authenticateToken, documentController.verifyDocument);

// Delete a document
router.delete('/documents/:docId', authenticateToken, documentController.deleteDocument);

export default router;
