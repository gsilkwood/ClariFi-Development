import axios, { AxiosInstance } from 'axios';
import { authClient } from './auth-client';
import { CreateLoanRequest, UpdateLoanRequest, LoanApplication, LoanStatusHistory } from '../types/loan';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class LoanClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    // Attach access token from authClient when present
    this.client.interceptors.request.use((config) => {
      const token = authClient.getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async createLoan(data: CreateLoanRequest): Promise<LoanApplication> {
    const res = await this.client.post<LoanApplication>('/loans', data);
    return res.data;
  }

  async getLoanApplications(): Promise<LoanApplication[]> {
    const res = await this.client.get<LoanApplication[]>('/loans');
    return res.data;
  }

  async getLoanApplication(id: string): Promise<LoanApplication> {
    const res = await this.client.get<LoanApplication>(`/loans/${id}`);
    return res.data;
  }

  async updateLoan(id: string, updates: UpdateLoanRequest): Promise<LoanApplication> {
    const res = await this.client.put<LoanApplication>(`/loans/${id}`, updates);
    return res.data;
    }

  async submitForReview(id: string): Promise<LoanApplication> {
    const res = await this.client.post<LoanApplication>(`/loans/${id}/submit`, {});
    return res.data;
  }

  async getLoanStatus(id: string): Promise<{ loanId: string; currentStatus: string; lastUpdated: string; history: LoanStatusHistory[] }>{
    const res = await this.client.get(`/loans/${id}/status`);
    return res.data;
  }

  async getStatusHistory(id: string): Promise<LoanStatusHistory[]> {
    const res = await this.client.get<LoanStatusHistory[]>(`/loans/${id}/history`);
    return res.data;
  }

  async deleteLoan(id: string): Promise<{ message: string }>{
    const res = await this.client.delete<{ message: string }>(`/loans/${id}`);
    return res.data;
  }
}

export const loanClient = new LoanClient();
