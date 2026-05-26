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
        <div className="ds-layout">
          <Sidebar />
          <div className="ds-main">
            <main className="ds-content">
              <div className="ds-content-inner">{children}</div>
            </main>
          </div>
        </div>
      ) : (
        <div className="ds-layout-user">
          <Navbar />
          <main className="ds-content-user">
            <div className="ds-content-inner">{children}</div>
          </main>
        </div>
      )}
    </ProtectedRoute>
  );
}
