'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { loginUser } from '@/services/authService';
import { Star, Eye, EyeOff, ArrowRight, Shield, Zap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, setAuth } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Username dan password harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser({ username, password });
      if (data.success && data.token && data.user) {
        setAuth(data.user, data.token);
        toast.success('Login berhasil!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Login gagal');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left: Visual panel */}
      <div className="auth-visual-panel">
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
              Selamat Datang<br />
              <span className="auth-visual-accent">Kembali.</span>
            </h2>
            <p className="auth-visual-desc">
              Masuk untuk melanjutkan melaporkan dan memantau status laporan Anda.
            </p>
          </motion.div>

          <motion.div
            className="auth-visual-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="auth-visual-feature">
              <div className="auth-vf-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                <Shield className="h-4 w-4" />
              </div>
              <span>Data aman & terenkripsi</span>
            </div>
            <div className="auth-visual-feature">
              <div className="auth-vf-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <Zap className="h-4 w-4" />
              </div>
              <span>Proses login cepat</span>
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
            <h1 className="auth-form-title">Masuk</h1>
            <p className="auth-form-subtitle">
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-group">
              <div className={`auth-field ${focusedField === 'username' ? 'auth-field-focused' : ''}`}>
                <label htmlFor="username" className="auth-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan username"
                  className="auth-input"
                  autoComplete="username"
                />
              </div>

              <div className={`auth-field ${focusedField === 'password' ? 'auth-field-focused' : ''}`}>
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan password"
                    className="auth-input"
                    autoComplete="current-password"
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
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              id="login-submit"
              className="auth-submit"
            >
              {isLoading ? (
                <div className="auth-spinner" />
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Belum punya akun?{' '}
              <Link href="/register" className="auth-link">
                Daftar sekarang
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
