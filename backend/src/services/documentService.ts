import { PrismaClient, Document } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://gsilkwood@localhost/clarifi',
    },
  },
});

export interface UploadDocumentRequest {
  loanId: string;
  documentType: string;
  documentName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedById: string;
  isRequired?: boolean;
}

export interface VerifyDocumentRequest {
  verifiedById: string;
  verificationStatus: string;
  notes?: string;
}

export const documentService = {
  /**
   * Upload a document for a loan
   */
  async uploadDocument(data: UploadDocumentRequest): Promise<Document> {
    // Validate loan exists
    const loan = await prisma.loanApplication.findUnique({
      where: { id: data.loanId },
    });
    if (!loan) {
      throw new Error('Loan not found');
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        loanId: data.loanId,
        documentType: data.documentType,
        documentName: data.documentName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        uploadedById: data.uploadedById,
        isRequired: data.isRequired ?? false,
        isReceived: true,
        extractionStatus: 'PENDING',
        verificationStatus: 'PENDING',
        uploadedAt: new Date(),
      },
    });

    return document;
  },

  /**
   * List all documents for a loan
   */
  async listDocuments(loanId: string): Promise<Document[]> {
    const documents = await prisma.document.findMany({
      where: { loanId },
      orderBy: { uploadedAt: 'desc' },
    });
    return documents;
  },

  /**
   * Get a single document by ID
   */
  async getDocument(documentId: string): Promise<Document | null> {
    return await prisma.document.findUnique({
      where: { id: documentId },
    });
  },

  /**
   * Verify/update verification status of a document
   */
  async verifyDocument(
    documentId: string,
    data: VerifyDocumentRequest
  ): Promise<Document> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    return await prisma.document.update({
      where: { id: documentId },
      data: {
        verificationStatus: data.verificationStatus,
        verifiedById: data.verifiedById,
        verifiedAt: new Date(),
      },
    });
  },

  /**
   * Delete a document (removes file and DB record)
   */
  async deleteDocument(documentId: string): Promise<void> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Delete file from filesystem
    try {
      const fullPath = path.resolve(__dirname, '../../', document.filePath || '');
      await fs.unlink(fullPath);
    } catch (err) {
      console.error(`Failed to delete file ${document.filePath}:`, err);
      // Continue even if file deletion fails
    }

    // Delete database record
    await prisma.document.delete({
      where: { id: documentId },
    });
  },
};
