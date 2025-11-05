"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useLoanStore } from '@/stores/loanStore';
import { LoanApplication } from '@/types/loan';

export default function LoansPage() {
  const { applications, isLoading, error, fetchLoanApplications } = useLoanStore();

  useEffect(() => {
    fetchLoanApplications();
  }, [fetchLoanApplications]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Loan Applications</h1>
        <Link
          href="/loans/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Application
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && applications.length === 0 && (
        <div className="text-gray-600">No applications yet. Create your first one!</div>
      )}

      {applications.length > 0 && (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app: LoanApplication) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{app.loanNumber}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 border">{app.status}</span>
                  </td>
                  <td className="px-4 py-3">${typeof app.loanAmount === 'string' ? app.loanAmount : app.loanAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">{app.loanTermMonths} mo</td>
                  <td className="px-4 py-3">{new Date(app.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/loans/${app.id}`}
                      className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
