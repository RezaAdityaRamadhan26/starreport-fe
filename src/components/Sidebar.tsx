'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard, FileText, Users, Settings,
  Star, LogOut, ChevronLeft, ChevronRight,
  FolderOpen, FilePlus, Map
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmModal } from './ConfirmModal';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin';

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    toast.success('Berhasil keluar');
    router.replace('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Semua Laporan', href: '/dashboard/reports', icon: FileText },
    { label: 'Peta Laporan', href: '/dashboard/maps', icon: Map },
    { label: 'Buat Laporan', href: '/dashboard/reports/create', icon: FilePlus },
    { label: 'Laporan Saya', href: '/dashboard/my-reports', icon: FolderOpen },
    ...(isSuperAdmin ? [{ label: 'Pengguna', href: '/dashboard/users', icon: Users }] : []),
    { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className={`ds-sidebar ${collapsed ? 'ds-sidebar-collapsed' : ''}`}>
      {/* Logo */}
      <div className="ds-sidebar-logo">
        {!collapsed ? (
          <Link href="/dashboard" className="ds-sidebar-brand">
            <div className="ds-sidebar-brand-icon">
              <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
            </div>
            <span className="ds-sidebar-brand-text">StarReport</span>
          </Link>
        ) : (
          <div className="ds-sidebar-brand-icon ds-sidebar-brand-icon-center">
            <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} className="ds-sidebar-toggle">
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Menu */}
      <nav className="ds-sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`ds-sidebar-link ${isActive ? 'ds-sidebar-link-active' : ''} ${collapsed ? 'ds-sidebar-link-collapsed' : ''}`}
            >
              <Icon className="h-[16px] w-[16px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="ds-sidebar-footer">
        {!collapsed ? (
          <div className="ds-sidebar-user">
            <div className="ds-sidebar-user-info">
              <div className="ds-avatar ds-avatar-sm">
                {user?.profile_picture ? (
                  <img src={`${UPLOADS_BASE_URL}/${user.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
                ) : (
                  user?.username?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="ds-sidebar-user-meta">
                <p className="ds-sidebar-username">{user?.username}</p>
                <p className="ds-sidebar-role">
                  {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
            <div className="ds-sidebar-user-actions">
              <div className="ds-sidebar-theme-wrap">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="ds-sidebar-logout"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="ds-sidebar-collapsed-actions">
            <div className="ds-sidebar-theme-wrap">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="ds-sidebar-logout"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari akun ini? Sesi Anda akan berakhir."
        confirmText="Setuju"
        cancelText="Tidak"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDestructive={true}
      />
    </aside>
  );
}
