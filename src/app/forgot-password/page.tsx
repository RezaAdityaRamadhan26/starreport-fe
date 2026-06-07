'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyReset, resetPassword } from '@/services/authService';
import { Star, Eye, EyeOff, ArrowRight, Shield, KeyRound, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Email atau username harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      const data = await verifyReset({ identifier });
      if (data.success) {
        toast.success('Akun ditemukan. Silakan buat password baru.');
        setStep(2);
      } else {
        toast.error(data.message || 'Akun tidak ditemukan');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan saat memverifikasi akun');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Semua kolom password harus diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok');
      return;
    }

    setIsLoading(true);
    try {
      const data = await resetPassword({ identifier, newPassword });
      if (data.success) {
        toast.success('Password berhasil direset! Silakan login kembali.');
        router.push('/login');
      } else {
        toast.error(data.message || 'Gagal mereset password');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan saat mereset password');
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
              Atur Ulang<br />
              <span className="auth-visual-accent">Akses Anda.</span>
            </h2>
            <p className="auth-visual-desc">
              Gunakan email atau username untuk memverifikasi identitas Anda dan mengatur password baru.
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
              <span>Verifikasi sistem aman</span>
            </div>
            <div className="auth-visual-feature">
              <div className="auth-vf-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <KeyRound className="h-4 w-4" />
              </div>
              <span>Enkripsi password baru</span>
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
            <h1 className="auth-form-title">Lupa Password</h1>
            <p className="auth-form-subtitle">
              {step === 1 ? 'Masukkan email atau username Anda untuk memverifikasi akun' : 'Buat password baru untuk akun Anda'}
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerify} 
                  className="auth-form"
                >
                  <div className="auth-field-group">
                    <div className={`auth-field ${focusedField === 'identifier' ? 'auth-field-focused' : ''}`}>
                      <label htmlFor="identifier" className="auth-label">
                        Username atau Email
                      </label>
                      <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onFocus={() => setFocusedField('identifier')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Contoh: andi123 atau andi@gmail.com"
                        className="auth-input"
                        autoComplete="username"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="auth-submit"
                      style={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', flex: 1 }}
                    >
                      <ArrowLeft className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                      <span>Kembali</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-submit"
                      style={{ flex: 1 }}
                    >
                      {isLoading ? (
                        <div className="auth-spinner" />
                      ) : (
                        <>
                          <span>Selanjutnya</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleReset} 
                  className="auth-form"
                >
                  <div className="auth-field-group">
                    <div className={`auth-field ${focusedField === 'newPassword' ? 'auth-field-focused' : ''}`}>
                      <label htmlFor="newPassword" className="auth-label">
                        Password Baru
                      </label>
                      <div className="auth-input-wrap">
                        <input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          onFocus={() => setFocusedField('newPassword')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Masukkan password baru"
                          className="auth-input"
                          autoComplete="new-password"
                          autoFocus
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

                    <div className={`auth-field ${focusedField === 'confirmPassword' ? 'auth-field-focused' : ''}`}>
                      <label htmlFor="confirmPassword" className="auth-label">
                        Konfirmasi Password
                      </label>
                      <div className="auth-input-wrap">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Ulangi password baru"
                          className="auth-input"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="auth-input-toggle"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="auth-submit"
                      style={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', flex: 1 }}
                    >
                      <ArrowLeft className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                      <span>Kembali</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-submit"
                      style={{ flex: 1 }}
                    >
                      {isLoading ? (
                        <div className="auth-spinner" />
                      ) : (
                        <>
                          <span>Ganti Password</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="auth-footer" style={{ marginTop: '2rem' }}>
            <p>
              Ingat password Anda?{' '}
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
