'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard, FileText, FilePlus, FolderOpen,
  Settings, Star, LogOut, Map, Menu, X
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="ds-topbar">
      <div className="ds-topbar-inner">
        {/* Logo */}
        <div className="ds-topbar-left">
          <Link href="/dashboard" className="ds-topbar-brand">
            <div className="ds-topbar-brand-icon">
              <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
            </div>
            <span className="ds-topbar-brand-text">StarReport</span>
          </Link>
        </div>

        {/* Nav Links (desktop) */}
        <nav className="ds-topbar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ds-topbar-link ${isActive ? 'ds-topbar-link-active' : ''}`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="ds-topbar-right">
          <ThemeToggle />
          
          <div className="ds-topbar-user">
            <div className="ds-avatar ds-avatar-sm">
              {user?.profile_picture ? (
                <img src={`${UPLOADS_BASE_URL}/${user.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="ds-topbar-username">{user?.username}</span>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="ds-topbar-logout"
            id="logout-button"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="ds-topbar-logout-text">Keluar</span>
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="ds-topbar-hamburger">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="ds-topbar-mobile-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`ds-topbar-mobile-link ${isActive ? 'ds-topbar-link-active' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
      
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
