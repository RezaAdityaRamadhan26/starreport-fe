'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Star, ArrowRight, Shield, MessageSquare, BarChart3,
  Eye, Zap, Users,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-card">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
              <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              StarReport
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg px-4 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-primary rounded-lg px-4 py-1.5 text-[13px]"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-card to-card" />

        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 text-center">
          {/* Badge */}
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[12px] font-medium text-emerald-700">
            <Star className="h-3 w-3" fill="currentColor" />
            Platform Laporan Masyarakat
          </div>

          {/* Massive headline */}
          <h1
            className="animate-fade-up mx-auto text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
            style={{ animationDelay: '80ms' }}
          >
            Suaramu penting.
            <br />
            <span className="text-emerald-500">Laporkan sekarang.</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted"
            style={{ animationDelay: '160ms' }}
          >
            Sampaikan keluhan, saran, dan laporan Anda kepada pihak terkait
            dengan mudah dan transparan. Setiap laporan akan ditindaklanjuti.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="/register"
              className="btn-primary group gap-2 rounded-xl px-6 py-2.5 text-sm"
            >
              Mulai Melapor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="btn-ghost rounded-xl px-6 py-2.5 text-sm"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Kenapa StarReport?
          </h2>
          <p className="mt-2 text-sm text-muted">
            Fitur yang dirancang untuk kemudahan pelaporan masyarakat.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Large card spanning 4 cols */}
          <div className="animate-fade-up card-base rounded-3xl p-8 md:col-span-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Aman & Terpercaya
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Data Anda dilindungi dengan enkripsi dan autentikasi yang ketat.
              Hanya pihak berwenang yang dapat mengakses laporan Anda.
            </p>
          </div>

          {/* Small card spanning 2 cols */}
          <div className="animate-fade-up card-base flex flex-col justify-between rounded-3xl p-8 md:col-span-2">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Cepat</h3>
              <p className="text-sm text-muted">
                Buat laporan dalam hitungan detik.
              </p>
            </div>
          </div>

          {/* Small card */}
          <div className="animate-fade-up card-base flex flex-col justify-between rounded-3xl p-8 md:col-span-2">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Eye className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Transparan</h3>
              <p className="text-sm text-muted">
                Pantau status laporan secara real-time.
              </p>
            </div>
          </div>

          {/* Large card spanning 4 cols */}
          <div className="animate-fade-up card-base rounded-3xl p-8 md:col-span-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Respon & Diskusi
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Admin akan meninjau dan merespon setiap laporan. Komentar dua arah
              memungkinkan komunikasi langsung antara pelapor dan petugas.
            </p>
          </div>

          {/* Full width stats card */}
          <div className="animate-fade-up card-base flex items-center justify-between rounded-3xl p-8 md:col-span-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-input-bg">
                <BarChart3 className="h-5 w-5 text-muted" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Dashboard Analitik
                </h3>
                <p className="text-sm text-muted">
                  Statistik laporan real-time untuk admin dan petugas.
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">24/7</p>
                <p className="text-[11px] text-muted/80">Monitoring</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-[11px] text-muted/80">Transparan</p>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted/80" />
                <p className="text-sm text-muted/80">Multi-role</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-[12px] text-muted/80">
        © 2026 StarReport. Hak cipta dilindungi.
      </footer>
    </div>
  );
}
