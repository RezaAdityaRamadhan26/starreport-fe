'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard, FileText, FilePlus, FolderOpen,
  Settings, Star, LogOut, Map
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmModal } from './ConfirmModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    toast.success('Berhasil keluar');
    router.replace('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Semua Laporan', href: '/dashboard/reports', icon: FileText },
    { label: 'Peta Laporan', href: '/dashboard/maps', icon: Map },
    { label: 'Buat Laporan', href: '/dashboard/reports/create', icon: FilePlus },
    { label: 'Laporan Saya', href: '/dashboard/my-reports', icon: FolderOpen },
    { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
            <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            StarReport
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-muted hover:bg-input-bg hover:text-muted'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-7 w-7 shrink-0 overflow-hidden items-center justify-center rounded-full bg-input-bg text-[11px] font-semibold text-muted">
              {user?.profile_picture ? (
                <img src={`${UPLOADS_BASE_URL}/${user.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-[13px] font-medium text-muted">{user?.username}</span>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted/80 transition-colors hover:bg-red-50 hover:text-red-600"
            id="logout-button"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari akun ini? Anda harus login kembali untuk mengakses halaman ini."
        confirmText="Setuju"
        cancelText="Tidak"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDestructive={true}
      />
    </header>
  );
}
