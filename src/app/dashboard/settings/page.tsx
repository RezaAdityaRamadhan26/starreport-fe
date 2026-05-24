'use client';

import { useState } from 'react';
import { changePassword, updateProfilePicture } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { Settings, Eye, EyeOff, Lock, User, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Password lama dan baru harus diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword });
      if (res.success) {
        toast.success('Password berhasil diubah');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Gagal mengubah password');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <Settings className="h-5 w-5 text-emerald-500" /> Pengaturan
        </h1>
        <p className="mt-1 text-sm text-muted">Kelola akun dan keamanan Anda.</p>
      </div>

      <div className="card-base rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-foreground">
          <User className="h-4 w-4 text-emerald-500" />
          Foto Profil
        </div>

        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 overflow-hidden items-center justify-center rounded-full bg-input-bg text-[24px] font-bold text-muted shadow-sm">
            {user?.profile_picture ? (
              <img src={`${UPLOADS_BASE_URL}/${user?.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1">
            <label
              htmlFor="profile-upload"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-muted shadow-sm transition-colors hover:bg-background hover:text-foreground"
            >
              {isUploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? 'Mengunggah...' : 'Pilih Foto'}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploading(true);
                try {
                  const res = await updateProfilePicture(file);
                  if (res.success && res.data) {
                    toast.success('Foto profil berhasil diperbarui');
                    if (user) {
                      setUser({ ...user, profile_picture: res.data.profile_picture });
                    }
                  } else {
                    toast.error(res.message || 'Gagal mengubah foto profil');
                  }
                } catch {
                  toast.error('Gagal mengunggah foto');
                } finally {
                  setIsUploading(false);
                }
              }}
            />
            <p className="mt-2 text-[12px] text-muted">JPG, PNG, atau GIF. Maks 2MB. (Langsung tersimpan)</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-base rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-foreground">
          <Lock className="h-4 w-4 text-emerald-500" />
          Ubah Password
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="old-pw" className="mb-1.5 block text-[13px] font-medium text-muted">Password Lama</label>
            <div className="relative">
              <input id="old-pw" type={showOld ? 'text' : 'password'} value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)} placeholder="Masukkan password lama" className="input-base pr-10" />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/80 hover:text-muted">
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-pw" className="mb-1.5 block text-[13px] font-medium text-muted">Password Baru</label>
            <div className="relative">
              <input id="new-pw" type={showNew ? 'text' : 'password'} value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" className="input-base pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/80 hover:text-muted">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-pw" className="mb-1.5 block text-[13px] font-medium text-muted">Konfirmasi Password Baru</label>
            <input id="confirm-pw" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" className="input-base" />
          </div>

          <button type="submit" disabled={isLoading} id="change-pw-submit" className="btn-primary w-full rounded-lg py-2.5 text-[13px]">
            {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Ubah Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
