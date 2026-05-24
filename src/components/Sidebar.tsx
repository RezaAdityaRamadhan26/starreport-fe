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
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
              <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              StarReport
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
            <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[52px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted/80 shadow-sm transition-colors hover:text-muted"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Menu */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 pt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-muted hover:bg-background hover:text-muted'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-[16px] w-[16px] shrink-0 ${isActive ? 'text-emerald-600' : ''}`} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-border p-3">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 overflow-hidden items-center justify-center rounded-full bg-input-bg text-[11px] font-semibold text-muted">
                {user?.profile_picture ? (
                  <img src={`${UPLOADS_BASE_URL}/${user.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
                ) : (
                  user?.username?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-muted">{user?.username}</p>
                <p className="text-[11px] text-muted/80">
                  {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="scale-75 origin-right">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="rounded-md p-1.5 text-muted/80 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="scale-75 origin-center">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted/80 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
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
