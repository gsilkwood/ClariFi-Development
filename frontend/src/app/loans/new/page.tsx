"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoanStore } from '@/stores/loanStore';
import { useAuthStore } from '@/stores/authStore';
import { CreateLoanRequest } from '@/types/loan';

export default function NewLoanPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createLoanApplication, isLoading, error, clearError } = useLoanStore();

  const [form, setForm] = useState<Partial<CreateLoanRequest>>({
    amount: 100000,
    term: 36,
    purpose: 'Home',
    employmentStatus: 'Employed',
    annualIncome: 75000,
    borrowerEmail: user?.email || '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' || name === 'annualIncome' || name === 'additionalIncome' || name === 'term' ? Number(value) : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (!form.amount || !form.term || !form.purpose || !form.employmentStatus || !form.annualIncome || !form.borrowerEmail) {
        throw new Error('Please fill all required fields');
      }
      const created = await createLoanApplication(form as CreateLoanRequest);
      router.push(`/loans/${created.id}`);
    } catch (err) {
      // error handled in store
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">New Loan Application</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Borrower Email</label>
          <input name="borrowerEmail" value={form.borrowerEmail || ''} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input name="amount" type="number" value={form.amount || ''} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Term (months)</label>
            <select name="term" value={form.term || 12} onChange={onChange} className="w-full border rounded px-3 py-2">
              {[12,24,36,48].map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Purpose</label>
          <input name="purpose" value={form.purpose || ''} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Employment Status</label>
          <select name="employmentStatus" value={form.employmentStatus || 'Employed'} onChange={onChange} className="w-full border rounded px-3 py-2">
            {['Employed','Self-Employed','Retired','Unemployed'].map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Annual Income</label>
            <input name="annualIncome" type="number" value={form.annualIncome || ''} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Additional Income (optional)</label>
            <input name="additionalIncome" type="number" value={form.additionalIncome || ''} onChange={onChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Creating...' : 'Create Application'}
          </button>
          <button type="button" onClick={() => router.push('/loans')} className="px-4 py-2 border rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
