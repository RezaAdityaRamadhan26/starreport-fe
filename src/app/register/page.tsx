'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { registerUser } from '@/services/authService';
import { Star, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
            <Star className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Buat Akun Baru
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Daftar untuk mulai menyampaikan laporan
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="card-base rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="reg-username" className="mb-1.5 block text-[13px] font-medium text-muted">
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Pilih username"
                className="input-base"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-[13px] font-medium text-muted">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="input-base pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/80 hover:text-muted"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm" className="mb-1.5 block text-[13px] font-medium text-muted">
                Konfirmasi Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                className="input-base"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              id="register-submit"
              className="btn-primary w-full rounded-lg py-2.5"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Daftar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[13px] text-muted">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
