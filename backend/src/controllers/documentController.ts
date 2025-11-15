import { Request, Response } from 'express';
import { documentService } from '../services/documentService';
import { UploadDocumentSchema, VerifyDocumentSchema } from '../utils/validation';
import { ValidationError, AuthenticationError, NotFoundError } from '../utils/errors';
import logger from '../lib/logger';

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

export const documentController = {
  /**
   * POST /api/loans/:id/documents
   */
  async uploadDocument(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    const loanId = req.params.id;
    const { documentType, documentName, isRequired } = req.body;
    const uploadedById = req.user?.userId;

    if (!uploadedById) {
      throw new AuthenticationError('Unauthorized');
    }

    const validationResult = UploadDocumentSchema.safeParse({
      documentType,
      documentName,
      isRequired,
    });

    if (!validationResult.success) {
      throw new ValidationError('Document upload validation failed',
        validationResult.error.flatten().fieldErrors as Record<string, any>);
    }

    try {
      const { documentType: validatedType, documentName: validatedName, isRequired: validatedIsRequired } = validationResult.data;

      const document = await documentService.uploadDocument({
        loanId,
        documentType: validatedType,
        documentName: validatedName || req.file.originalname,
        filePath: `uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedById,
        isRequired: validatedIsRequired === true,
      });

      logger.info('Document uploaded', { docId: document.id, loanId });
      res.status(201).json(document);
    } catch (error: any) {
      if (error.message === 'Loan not found') {
        throw new NotFoundError('Loan');
      }
      throw error;
    }
  },

  /**
   * GET /api/loans/:id/documents
   */
  async listDocuments(req: Request, res: Response): Promise<void> {
    const loanId = req.params.id;
    const documents = await documentService.listDocuments(loanId);
    res.json(documents);
  },

  /**
   * POST /api/documents/:docId/verify
   */
  async verifyDocument(req: Request, res: Response): Promise<void> {
    const docId = req.params.docId;
    const verifiedById = req.user?.userId;

    if (!verifiedById) {
      throw new AuthenticationError('Unauthorized');
    }

    const validationResult = VerifyDocumentSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new ValidationError('Document verification validation failed',
        validationResult.error.flatten().fieldErrors as Record<string, any>);
    }

    const { verificationStatus } = validationResult.data;

    try {
      const document = await documentService.verifyDocument(docId, {
        verifiedById,
        verificationStatus,
      });

      logger.info('Document verified', { docId, status: verificationStatus });
      res.json(document);
    } catch (error: any) {
      if (error.message === 'Document not found') {
        throw new NotFoundError('Document');
      }
      throw error;
    }
  },

  /**
   * DELETE /api/documents/:docId
   */
  async deleteDocument(req: Request, res: Response): Promise<void> {
    const docId = req.params.docId;

    try {
      await documentService.deleteDocument(docId);
      logger.info('Document deleted', { docId });
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Document not found') {
        throw new NotFoundError('Document');
      }
      throw error;
    }
  },
};
