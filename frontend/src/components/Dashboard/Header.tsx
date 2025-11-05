"use client";

import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="px-6 py-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold">ClariFi Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-gray-600">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
