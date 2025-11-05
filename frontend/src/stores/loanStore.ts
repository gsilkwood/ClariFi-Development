"use client";

import { create } from 'zustand';
import { loanClient } from '@/lib/loan-client';
import { LoanApplication, LoanStatusHistory, CreateLoanRequest, UpdateLoanRequest } from '@/types/loan';

export interface LoanStoreState {
  applications: LoanApplication[];
  currentApplication: LoanApplication | null;
  statusHistory: LoanStatusHistory[];
  isLoading: boolean;
  error: string | null;

  fetchLoanApplications: () => Promise<void>;
  fetchLoanApplication: (id: string) => Promise<void>;
  createLoanApplication: (data: CreateLoanRequest) => Promise<LoanApplication>;
  updateLoanApplication: (id: string, data: UpdateLoanRequest) => Promise<LoanApplication>;
  submitForReview: (id: string) => Promise<LoanApplication>;
  fetchStatusHistory: (id: string) => Promise<void>;
  deleteLoanApplication: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useLoanStore = create<LoanStoreState>((set, get) => ({
  applications: [],
  currentApplication: null,
  statusHistory: [],
  isLoading: false,
  error: null,

  fetchLoanApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const apps = await loanClient.getLoanApplications();
      set({ applications: apps, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch applications', isLoading: false });
    }
  },

  fetchLoanApplication: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const app = await loanClient.getLoanApplication(id);
      set({ currentApplication: app, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch application', isLoading: false });
    }
  },

  createLoanApplication: async (data: CreateLoanRequest) => {
    set({ isLoading: true, error: null });
    try {
      const created = await loanClient.createLoan(data);
      set({ isLoading: false });
      await get().fetchLoanApplications();
      return created;
    } catch (err: any) {
      const error = err.response?.data?.error || 'Failed to create loan';
      set({ error, isLoading: false });
      throw err;
    }
  },

  updateLoanApplication: async (id: string, data: UpdateLoanRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await loanClient.updateLoan(id, data);
      set({ currentApplication: updated, isLoading: false });
      return updated;
    } catch (err: any) {
      const error = err.response?.data?.error || 'Failed to update loan';
      set({ error, isLoading: false });
      throw err;
    }
  },

  submitForReview: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await loanClient.submitForReview(id);
      set({ currentApplication: updated, isLoading: false });
      return updated;
    } catch (err: any) {
      const error = err.response?.data?.error || 'Failed to submit loan';
      set({ error, isLoading: false });
      throw err;
    }
  },

  fetchStatusHistory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const hist = await loanClient.getStatusHistory(id);
      set({ statusHistory: hist, isLoading: false });
    } catch (err: any) {
      const error = err.response?.data?.error || 'Failed to fetch status history';
      set({ error, isLoading: false });
    }
  },

  deleteLoanApplication: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await loanClient.deleteLoan(id);
      set({ isLoading: false, currentApplication: null });
      await get().fetchLoanApplications();
    } catch (err: any) {
      const error = err.response?.data?.error || 'Failed to delete loan';
      set({ error, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
