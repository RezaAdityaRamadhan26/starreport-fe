'use client';

import { useState } from 'react';
import { changePassword, updateProfilePicture } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { Settings, Eye, EyeOff, Lock, User, Upload } from 'lucide-react';
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
    <div style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="ds-page-header">
        <h1 className="ds-page-title ds-page-title-icon">
          <Settings className="h-5 w-5" style={{ color: '#10b981' }} /> Pengaturan
        </h1>
        <p className="ds-page-subtitle">Kelola akun dan keamanan Anda.</p>
      </div>

      {/* Profile Picture */}
      <div className="ds-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)' }}>
          <User className="h-4 w-4" style={{ color: '#10b981' }} />
          Foto Profil
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="ds-avatar ds-avatar-lg">
            {user?.profile_picture ? (
              <img src={`${UPLOADS_BASE_URL}/${user?.profile_picture}`} className="h-full w-full object-cover" alt="avatar" />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <label htmlFor="profile-upload" className="ds-upload-btn">
              {isUploading ? (
                <div className="ds-spinner-ring" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
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
              style={{ display: 'none' }}
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
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
              JPG, PNG, atau GIF. Maks 2MB. (Langsung tersimpan)
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleSubmit} className="ds-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)' }}>
          <Lock className="h-4 w-4" style={{ color: '#10b981' }} />
          Ubah Password
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="auth-field">
            <label htmlFor="old-pw" className="auth-label">Password Lama</label>
            <div className="auth-input-wrap">
              <input id="old-pw" type={showOld ? 'text' : 'password'} value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)} placeholder="Masukkan password lama" className="auth-input" />
              <button type="button" onClick={() => setShowOld(!showOld)} className="auth-input-toggle">
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="new-pw" className="auth-label">Password Baru</label>
            <div className="auth-input-wrap">
              <input id="new-pw" type={showNew ? 'text' : 'password'} value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" className="auth-input" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="auth-input-toggle">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-pw" className="auth-label">Konfirmasi Password Baru</label>
            <input id="confirm-pw" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" className="auth-input" />
          </div>

          <button type="submit" disabled={isLoading} id="change-pw-submit" className="auth-submit">
            {isLoading ? <div className="auth-spinner" /> : 'Ubah Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
