"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoanStore } from '@/stores/loanStore';

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

  useEffect(() => {
    if (id) {
      fetchLoanApplication(id);
      fetchStatusHistory(id);
    }
  }, [id, fetchLoanApplication, fetchStatusHistory]);

  const onSubmit = async () => {
    if (!id) return;
    await submitForReview(id);
  };

  const onDelete = async () => {
    if (!id) return;
    await deleteLoanApplication(id);
    router.push('/loans');
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
        </div>
      )}
    </div>
  );
}
