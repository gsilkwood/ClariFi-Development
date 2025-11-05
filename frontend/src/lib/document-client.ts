import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Document {
  id: string;
  loanId: string;
  documentType: string;
  documentName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isRequired: boolean;
  isReceived: boolean;
  extractionStatus: string;
  verificationStatus: string;
  uploadedById: string;
  uploadedAt: string;
  verifiedById: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const documentClient = {
  async uploadDocument(
    loanId: string,
    file: File,
    documentType: string,
    documentName?: string,
    isRequired = false
  ): Promise<Document> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (documentName) {
      formData.append('documentName', documentName);
    }
    formData.append('isRequired', isRequired.toString());

    const response = await axios.post(
      `${API_BASE_URL}/loans/${loanId}/documents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async listDocuments(loanId: string): Promise<Document[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/loans/${loanId}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async verifyDocument(docId: string, verificationStatus: string): Promise<Document> {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/documents/${docId}/verify`,
      { verificationStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  async deleteDocument(docId: string): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/documents/${docId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
