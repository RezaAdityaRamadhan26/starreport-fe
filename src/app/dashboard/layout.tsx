'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <ProtectedRoute>
      {isAdmin ? (
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="ml-56 flex flex-1 flex-col transition-all duration-200">
            <main className="flex-1 px-8 py-6">
              <div className="mx-auto max-w-5xl">{children}</div>
            </main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="px-6 py-6">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      )}
    </ProtectedRoute>
  );
}
