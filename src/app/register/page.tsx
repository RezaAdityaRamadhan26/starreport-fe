'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { registerUser } from '@/services/authService';
import { Star, Eye, EyeOff, ArrowRight, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Lemah', color: '#ef4444' };
    if (password.length < 10) return { level: 2, text: 'Cukup', color: '#f59e0b' };
    return { level: 3, text: 'Kuat', color: '#10b981' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Username dan password harus diisi');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi tidak cocok');
      return;
    }
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser({ username, password });
      if (data.success) {
        toast.success('Registrasi berhasil! Silakan login.');
        router.push('/login');
      } else {
        toast.error(data.message || 'Registrasi gagal');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left: Visual panel */}
      <div className="auth-visual-panel auth-visual-register">
        <div className="auth-visual-mesh" />
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />

        <div className="auth-visual-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="auth-brand">
              <div className="auth-brand-icon">
                <Star className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="auth-brand-text">StarReport</span>
            </Link>
          </motion.div>

          <motion.div
            className="auth-visual-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <h2 className="auth-visual-title">
              Mulai Perjalanan<br />
              <span className="auth-visual-accent">Anda Hari Ini.</span>
            </h2>
            <p className="auth-visual-desc">
              Bergabung dan jadilah bagian dari masyarakat yang aktif berkontribusi untuk lingkungan yang lebih baik.
            </p>
          </motion.div>

          <motion.div
            className="auth-visual-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="auth-visual-feature">
              <div className="auth-vf-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                <Users className="h-4 w-4" />
              </div>
              <span>Gratis untuk semua</span>
            </div>
            <div className="auth-visual-feature">
              <div className="auth-vf-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span>Daftar dalam hitungan detik</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-topbar">
          <ThemeToggle />
        </div>

        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile logo */}
          <div className="auth-mobile-brand">
            <Link href="/" className="auth-brand">
              <div className="auth-brand-icon">
                <Star className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <span className="auth-brand-text">StarReport</span>
            </Link>
          </div>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Buat Akun</h1>
            <p className="auth-form-subtitle">
              Daftar gratis untuk mulai menyampaikan laporan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-group">
              <div className={`auth-field ${focusedField === 'username' ? 'auth-field-focused' : ''}`}>
                <label htmlFor="reg-username" className="auth-label">
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Pilih username"
                  className="auth-input"
                  autoComplete="username"
                />
              </div>

              <div className={`auth-field ${focusedField === 'password' ? 'auth-field-focused' : ''}`}>
                <label htmlFor="reg-password" className="auth-label">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Minimal 6 karakter"
                    className="auth-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-input-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="auth-pw-strength">
                    <div className="auth-pw-bar">
                      <motion.div
                        className="auth-pw-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                        style={{ background: passwordStrength.color }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="auth-pw-text" style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className={`auth-field ${focusedField === 'confirm' ? 'auth-field-focused' : ''}`}>
                <label htmlFor="reg-confirm" className="auth-label">
                  Konfirmasi Password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ulangi password"
                  className="auth-input"
                  autoComplete="new-password"
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <span className="auth-field-error">Password tidak cocok</span>
                )}
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <span className="auth-field-match">
                    <CheckCircle2 className="h-3 w-3" /> Cocok
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              id="register-submit"
              className="auth-submit"
            >
              {isLoading ? (
                <div className="auth-spinner" />
              ) : (
                <>
                  <span>Buat Akun</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Sudah punya akun?{' '}
              <Link href="/login" className="auth-link">
                Masuk di sini
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
