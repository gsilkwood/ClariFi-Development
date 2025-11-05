'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, hydrateFromStorage, isLoading } = useAuthStore();

  // Hydrate auth state and check authentication
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const displayName = user.firstName || user.username;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {displayName}! 👋</h2>
            <p className="text-gray-600 mb-6">
              You're successfully logged in to your ClariFi account. Start by exploring your loan applications or uploading documents.
            </p>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="pt-6">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              <div className="pt-6">
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-lg font-medium text-gray-900">{user.username}</p>
              </div>
              <div className="pt-6">
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-medium text-gray-900">{user.role.name}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-bold text-gray-900 mb-2">Loan Applications</h3>
              <p className="text-sm text-gray-600">View and manage your loan applications</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-bold text-gray-900 mb-2">Documents</h3>
              <p className="text-sm text-gray-600">Upload and manage your documents</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-gray-900 mb-2">Messages</h3>
              <p className="text-sm text-gray-600">Communicate with loan officers</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="font-bold text-gray-900 mb-2">Settings</h3>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white rounded-lg shadow p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Getting Started</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Account Created</p>
                  <p className="text-sm text-gray-600">Your account is active and ready to use</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold">○</span>
                <div>
                  <p className="font-medium text-gray-900">Complete Your Profile</p>
                  <p className="text-sm text-gray-600">Add your personal information for a better experience</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold">○</span>
                <div>
                  <p className="font-medium text-gray-900">Start a Loan Application</p>
                  <p className="text-sm text-gray-600">Begin your first loan application to get started</p>
                </div>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
