"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoanStore } from '@/stores/loanStore';
import { documentClient, Document } from '@/lib/document-client';

export default function LoanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    currentApplication,
    statusHistory,
    isLoading,
    error,
    fetchLoanApplication,
    fetchStatusHistory,
    submitForReview,
    deleteLoanApplication,
  } = useLoanStore();

  const id = params?.id as string;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('INCOME_STATEMENT');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLoanApplication(id);
      fetchStatusHistory(id);
      loadDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDocuments = async () => {
    if (!id) return;
    try {
      const docs = await documentClient.listDocuments(id);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents', err);
    }
  };

  const onSubmit = async () => {
    if (!id) return;
    await submitForReview(id);
  };

  const onDelete = async () => {
    if (!id) return;
    await deleteLoanApplication(id);
    router.push('/loans');
  };

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !uploadFile) return;
    setUploading(true);
    try {
      await documentClient.uploadDocument(id, uploadFile, documentType);
      setUploadFile(null);
      await loadDocuments();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const onVerify = async (docId: string, status: string) => {
    try {
      await documentClient.verifyDocument(docId, status);
      await loadDocuments();
    } catch (err) {
      console.error('Verify failed', err);
    }
  };

  const onDeleteDoc = async (docId: string) => {
    try {
      await documentClient.deleteDocument(docId);
      await loadDocuments();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Loan Details</h1>
        <Link href="/loans" className="text-blue-600 hover:underline">Back to list</Link>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {currentApplication && (
        <div className="space-y-6">
          <div className="rounded border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Loan #</div>
                <div className="font-mono">{currentApplication.loanNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div>
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 border">{currentApplication.status}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div>
                  ${typeof currentApplication.loanAmount === 'string' ? currentApplication.loanAmount : currentApplication.loanAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Term</div>
                <div>{currentApplication.loanTermMonths} months</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-500">Purpose</div>
                <div>{currentApplication.purpose || '-'}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Submit for Review
              </button>
              <button onClick={onDelete} className="px-4 py-2 border rounded hover:bg-gray-50">
                Delete (Draft)
              </button>
            </div>
          </div>

          <div className="rounded border p-4">
            <h2 className="text-lg font-medium mb-3">Status History</h2>
            {statusHistory.length === 0 && <div className="text-gray-500">No history yet</div>}
            <ul className="space-y-2">
              {statusHistory.map((h) => (
                <li key={h.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{h.fromStatus || '-'}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{h.toStatus}</span>
                  </div>
                  <div className="text-gray-500">{new Date(h.changedAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border p-4">
            <h2 className="text-lg font-medium mb-3">Documents</h2>
            <form onSubmit={onUpload} className="mb-4 space-y-3">
              <div>
                <label className="block text-sm mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="INCOME_STATEMENT">Income Statement</option>
                  <option value="TAX_RETURN">Tax Return</option>
                  <option value="BANK_STATEMENT">Bank Statement</option>
                  <option value="IDENTIFICATION">Identification</option>
                  <option value="PROOF_OF_ADDRESS">Proof of Address</option>
                  <option value="PROPERTY_APPRAISAL">Property Appraisal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={!uploadFile || uploading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>

            {documents.length === 0 && <div className="text-gray-500">No documents uploaded yet</div>}
            {documents.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Uploaded</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b">
                      <td className="py-2">{doc.documentName}</td>
                      <td className="py-2">{doc.documentType}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 text-xs rounded bg-gray-100 border">
                          {doc.verificationStatus}
                        </span>
                      </td>
                      <td className="py-2">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                      <td className="py-2 space-x-2">
                        {doc.verificationStatus === 'PENDING' && (
                          <button
                            onClick={() => onVerify(doc.id, 'VERIFIED')}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteDoc(doc.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
