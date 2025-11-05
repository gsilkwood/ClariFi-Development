import { Request, Response } from 'express';
import { documentService } from '../services/documentService';

// Extend Express Request type to include user from JWT middleware
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

const DOCUMENT_TYPES = [
  'INCOME_STATEMENT',
  'TAX_RETURN',
  'BANK_STATEMENT',
  'IDENTIFICATION',
  'PROOF_OF_ADDRESS',
  'PROPERTY_APPRAISAL',
  'OTHER',
];

const VERIFICATION_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_REVIEW'];

export const documentController = {
  /**
   * POST /api/loans/:id/documents
   */
  async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const loanId = req.params.id;
      const { documentType, documentName, isRequired } = req.body;
      const uploadedById = req.user?.userId;

      if (!uploadedById) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!DOCUMENT_TYPES.includes(documentType)) {
        res.status(400).json({ error: 'Invalid document type' });
        return;
      }

      const document = await documentService.uploadDocument({
        loanId,
        documentType,
        documentName: documentName || req.file.originalname,
        filePath: `uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedById,
        isRequired: isRequired === 'true',
      });

      res.status(201).json(document);
    } catch (error: any) {
      if (error.message === 'Loan not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to upload document' });
      }
    }
  },

  /**
   * GET /api/loans/:id/documents
   */
  async listDocuments(req: Request, res: Response): Promise<void> {
    try {
      const loanId = req.params.id;
      const documents = await documentService.listDocuments(loanId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  },

  /**
   * POST /api/documents/:docId/verify
   */
  async verifyDocument(req: Request, res: Response): Promise<void> {
    try {
      const docId = req.params.docId;
      const { verificationStatus } = req.body;
      const verifiedById = req.user?.userId;

      if (!verifiedById) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!VERIFICATION_STATUSES.includes(verificationStatus)) {
        res.status(400).json({ error: 'Invalid verification status' });
        return;
      }

      const document = await documentService.verifyDocument(docId, {
        verifiedById,
        verificationStatus,
      });

      res.json(document);
    } catch (error: any) {
      if (error.message === 'Document not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to verify document' });
      }
    }
  },

  /**
   * DELETE /api/documents/:docId
   */
  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const docId = req.params.docId;
      await documentService.deleteDocument(docId);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Document not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete document' });
      }
    }
  },
};
