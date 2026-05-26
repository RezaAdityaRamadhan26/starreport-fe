'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Star, ArrowRight, Shield, MessageSquare,
  Eye, Zap, Users, ChevronDown, Sparkles, MapPin, Clock,
  CheckCircle2, ArrowUpRight,
} from 'lucide-react';

/* ───────────────────── Reusable Section Reveal ───────────────────── */
function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────── Floating Particle ───────────────────── */
function FloatingParticle({ size, x, y, delay, duration }: {
  size: number; x: string; y: string; delay: number; duration: number;
}) {
  return (
    <motion.div
      className="landing-particle"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -5, 8, 0],
        opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ───────────────────── Step Card ───────────────────── */
function StepCard({ number, title, desc, icon: Icon, delay }: {
  number: string; title: string; desc: string;
  icon: React.ElementType; delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="landing-step-card group">
        <div className="landing-step-number">{number}</div>
        <div className="landing-step-icon">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="landing-step-title">{title}</h3>
        <p className="landing-step-desc">{desc}</p>
      </div>
    </Reveal>
  );
}

/* ───────────────────── Feature Showcase (Interactive) ───────────────────── */
const FEATURES = [
  {
    id: 'security',
    icon: Shield,
    title: 'Keamanan Berlapis',
    shortDesc: 'Data terenkripsi & terlindungi',
    fullDesc: 'Setiap data yang Anda kirimkan dilindungi dengan sistem autentikasi berlapis. Hanya petugas berwenang yang dapat mengakses informasi sensitif laporan Anda.',
    visual: 'shield',
    accent: '#3b82f6',
    accentLight: 'rgba(59, 130, 246, 0.1)',
    stats: [
      { label: 'Enkripsi', value: 'AES-256' },
      { label: 'Auth', value: '2-Factor' },
    ],
  },
  {
    id: 'speed',
    icon: Zap,
    title: 'Super Cepat',
    shortDesc: 'Laporan selesai < 2 menit',
    fullDesc: 'Interface yang dioptimalkan untuk kecepatan. Buat laporan lengkap dengan foto dan lokasi dalam waktu kurang dari 2 menit tanpa proses berbelit.',
    visual: 'speed',
    accent: '#f59e0b',
    accentLight: 'rgba(245, 158, 11, 0.1)',
    stats: [
      { label: 'Waktu', value: '< 2 min' },
      { label: 'Upload', value: 'Instant' },
    ],
  },
  {
    id: 'transparent',
    icon: Eye,
    title: 'Transparan',
    shortDesc: 'Pantau progress real-time',
    fullDesc: 'Pantau setiap tahap proses laporan Anda secara real-time. Status terupdate otomatis dari pending hingga selesai ditangani oleh petugas.',
    visual: 'eye',
    accent: '#10b981',
    accentLight: 'rgba(16, 185, 129, 0.1)',
    stats: [
      { label: 'Update', value: 'Real-time' },
      { label: 'Tracking', value: 'End-to-end' },
    ],
  },
  {
    id: 'communication',
    icon: MessageSquare,
    title: 'Diskusi Langsung',
    shortDesc: 'Chat terintegrasi dua arah',
    fullDesc: 'Diskusi langsung antara pelapor dan petugas melalui sistem komentar terintegrasi. Tidak perlu aplikasi tambahan untuk berkomunikasi.',
    visual: 'chat',
    accent: '#a855f7',
    accentLight: 'rgba(168, 85, 247, 0.1)',
    stats: [
      { label: 'Chat', value: 'Built-in' },
      { label: 'Notifikasi', value: 'Otomatis' },
    ],
  },
] as const;

function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const feat = FEATURES[active];
  const Icon = feat.icon;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <div ref={containerRef} className="ft-showcase">
      {/* Left: Tab selectors */}
      <div className="ft-tabs">
        {FEATURES.map((f, i) => {
          const TabIcon = f.icon;
          const isActive = i === active;
          return (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              className={`ft-tab ${isActive ? 'ft-tab-active' : ''}`}
              style={{ '--tab-accent': f.accent, '--tab-accent-light': f.accentLight } as React.CSSProperties}
            >
              <div className="ft-tab-indicator" />
              <div className="ft-tab-icon">
                <TabIcon className="h-[18px] w-[18px]" />
              </div>
              <div className="ft-tab-text">
                <span className="ft-tab-title">{f.title}</span>
                <span className="ft-tab-subtitle">{f.shortDesc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right: Active feature preview */}
      <motion.div
        className="ft-preview"
        key={feat.id}
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ '--preview-accent': feat.accent, '--preview-accent-light': feat.accentLight } as React.CSSProperties}
      >
        {/* Visual illustration area */}
        <div className="ft-preview-visual">
          <div className="ft-visual-scene">
            {/* Abstract decorative shapes unique to each feature */}
            {feat.visual === 'shield' && (
              <>
                <div className="ft-shape ft-shape-ring" style={{ width: 80, height: 80, top: '20%', left: '15%', borderColor: 'rgba(59,130,246,0.2)' }} />
                <div className="ft-shape ft-shape-dot" style={{ width: 12, height: 12, top: '30%', right: '25%', background: '#3b82f6' }} />
                <div className="ft-shape ft-shape-line" style={{ width: 40, top: '65%', left: '20%', background: 'rgba(59,130,246,0.3)' }} />
                <div className="ft-shape ft-shape-dot" style={{ width: 8, height: 8, bottom: '25%', right: '30%', background: 'rgba(59,130,246,0.4)' }} />
                <div className="ft-shape-lockicon">
                  <Shield className="h-10 w-10" style={{ color: '#3b82f6' }} />
                </div>
              </>
            )}
            {feat.visual === 'speed' && (
              <>
                <div className="ft-shape ft-shape-line" style={{ width: 60, top: '25%', left: '10%', background: 'rgba(245,158,11,0.4)', transform: 'rotate(-5deg)' }} />
                <div className="ft-shape ft-shape-line" style={{ width: 45, top: '40%', left: '15%', background: 'rgba(245,158,11,0.25)', transform: 'rotate(-5deg)' }} />
                <div className="ft-shape ft-shape-line" style={{ width: 30, top: '55%', left: '20%', background: 'rgba(245,158,11,0.15)', transform: 'rotate(-5deg)' }} />
                <div className="ft-shape ft-shape-dot" style={{ width: 14, height: 14, top: '20%', right: '20%', background: '#f59e0b' }} />
                <div className="ft-shape-lockicon">
                  <Zap className="h-10 w-10" style={{ color: '#f59e0b' }} />
                </div>
              </>
            )}
            {feat.visual === 'eye' && (
              <>
                <div className="ft-shape ft-shape-ring" style={{ width: 60, height: 60, top: '15%', right: '20%', borderColor: 'rgba(16,185,129,0.25)' }} />
                <div className="ft-shape ft-shape-ring" style={{ width: 100, height: 100, bottom: '10%', left: '10%', borderColor: 'rgba(16,185,129,0.12)' }} />
                <div className="ft-shape ft-shape-dot" style={{ width: 10, height: 10, top: '45%', left: '25%', background: '#10b981' }} />
                <div className="ft-shape-lockicon">
                  <Eye className="h-10 w-10" style={{ color: '#10b981' }} />
                </div>
              </>
            )}
            {feat.visual === 'chat' && (
              <>
                <div className="ft-shape ft-shape-chatbubble" style={{ top: '15%', left: '12%', background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.15)' }}>
                  <div className="ft-chatbubble-dots">
                    <span /><span /><span />
                  </div>
                </div>
                <div className="ft-shape ft-shape-chatbubble ft-chatbubble-reply" style={{ top: '45%', right: '12%', background: 'rgba(168,85,247,0.06)', borderColor: 'rgba(168,85,247,0.1)' }}>
                  <div className="ft-chatbubble-line" />
                  <div className="ft-chatbubble-line ft-chatbubble-line-short" />
                </div>
                <div className="ft-shape ft-shape-dot" style={{ width: 8, height: 8, bottom: '20%', left: '30%', background: 'rgba(168,85,247,0.4)' }} />
                <div className="ft-shape-lockicon">
                  <MessageSquare className="h-10 w-10" style={{ color: '#a855f7' }} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Text content */}
        <div className="ft-preview-body">
          <div className="ft-preview-icon-badge" style={{ background: feat.accentLight, color: feat.accent }}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="ft-preview-title">{feat.title}</h3>
          <p className="ft-preview-desc">{feat.fullDesc}</p>

          {/* Mini stats */}
          <div className="ft-preview-stats">
            {feat.stats.map((s) => (
              <div key={s.label} className="ft-preview-stat">
                <span className="ft-preview-stat-value" style={{ color: feat.accent }}>{s.value}</span>
                <span className="ft-preview-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-root">
      {/* ─── NAVBAR ─── */}
      <motion.nav
        className={`landing-nav ${navScrolled ? 'landing-nav-scrolled' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="landing-nav-inner">
          <Link href="/" className="landing-logo group">
            <div className="landing-logo-icon">
              <Star className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <span className="landing-logo-text">StarReport</span>
          </Link>

          <div className="landing-nav-actions">
            <ThemeToggle />
            <Link href="/login" className="landing-nav-link">
              Masuk
            </Link>
            <Link href="/register" className="landing-btn-primary">
              <span>Daftar Gratis</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="landing-hero">
        {/* Mesh gradient background */}
        <div className="landing-hero-mesh" />

        {/* Organic blob shapes */}
        <div className="landing-blob landing-blob-1" />
        <div className="landing-blob landing-blob-2" />
        <div className="landing-blob landing-blob-3" />

        {/* Floating particles */}
        <div className="landing-particles">
          <FloatingParticle size={6} x="15%" y="25%" delay={0} duration={6} />
          <FloatingParticle size={4} x="80%" y="20%" delay={1} duration={8} />
          <FloatingParticle size={8} x="60%" y="60%" delay={2} duration={7} />
          <FloatingParticle size={5} x="30%" y="70%" delay={0.5} duration={9} />
          <FloatingParticle size={3} x="85%" y="55%" delay={1.5} duration={6.5} />
          <FloatingParticle size={7} x="10%" y="50%" delay={3} duration={7.5} />
          <FloatingParticle size={4} x="50%" y="15%" delay={2.5} duration={8.5} />
        </div>

        <motion.div
          className="landing-hero-content"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Pill badge */}
          <motion.div
            className="landing-pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Laporan Masyarakat #1</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="landing-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="landing-headline-line">Suara Anda</span>
            <span className="landing-headline-accent">Mengubah Segalanya.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="landing-subheadline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
          >
            Sampaikan keluhan, saran, dan aspirasi Anda langsung kepada pihak yang
            berwenang. Setiap laporan akan ditindaklanjuti secara transparan dan akuntabel.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="landing-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link href="/register" className="landing-btn-hero group">
              <span>Mulai Melapor</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="landing-btn-outline group">
              <span>Sudah Punya Akun</span>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="landing-social-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="landing-avatar-stack">
              {[...'ABCDE'].map((letter, i) => (
                <div
                  key={letter}
                  className="landing-avatar"
                  style={{ zIndex: 5 - i }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="landing-proof-text">
              <div className="landing-proof-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <span>Dipercaya oleh masyarakat</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="landing-scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <Reveal>
            <div className="landing-section-header">
              <span className="landing-section-label">Cara Kerja</span>
              <h2 className="landing-section-title">
                Tiga Langkah <span className="landing-text-gradient">Mudah</span>
              </h2>
              <p className="landing-section-subtitle">
                Proses pelaporan yang sederhana, cepat, dan tanpa ribet.
              </p>
            </div>
          </Reveal>

          <div className="landing-steps-grid">
            <StepCard
              number="01"
              title="Buat Akun"
              desc="Daftar dengan email dan buat akun secara gratis dalam hitungan detik."
              icon={Users}
              delay={0.1}
            />
            <StepCard
              number="02"
              title="Tulis Laporan"
              desc="Isi detail laporan, tambahkan foto, dan tandai lokasi kejadian."
              icon={MapPin}
              delay={0.2}
            />
            <StepCard
              number="03"
              title="Pantau Status"
              desc="Dapatkan update real-time dan notifikasi saat laporan direspon."
              icon={CheckCircle2}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <Reveal>
            <div className="landing-section-header">
              <span className="landing-section-label">Fitur Unggulan</span>
              <h2 className="landing-section-title">
                Kenapa Memilih <span className="landing-text-gradient">StarReport?</span>
              </h2>
              <p className="landing-section-subtitle">
                Dirancang dengan teknologi modern untuk pengalaman pelaporan terbaik.
              </p>
            </div>
          </Reveal>

          <FeatureShowcase />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <Reveal>
            <div className="landing-stats-card">
              <div className="landing-stats-grid">
                {[
                  { value: '24/7', label: 'Monitoring Aktif', icon: Clock },
                  { value: '100%', label: 'Transparan', icon: Eye },
                  { value: '< 2 min', label: 'Buat Laporan', icon: Zap },
                  { value: 'Multi', label: 'Role & Akses', icon: Users },
                ].map((stat, i) => (
                  <Reveal key={stat.label} delay={0.1 * i}>
                    <div className="landing-stat-item">
                      <stat.icon className="landing-stat-icon" />
                      <div className="landing-stat-value">{stat.value}</div>
                      <div className="landing-stat-label">{stat.label}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <Reveal>
            <div className="landing-final-cta">
              <div className="landing-final-cta-bg" />
              <div className="landing-final-cta-content">
                <h2 className="landing-final-title">
                  Siap Membuat Perubahan?
                </h2>
                <p className="landing-final-desc">
                  Bergabung sekarang dan jadilah bagian dari masyarakat yang aktif
                  berkontribusi untuk lingkungan yang lebih baik.
                </p>
                <div className="landing-final-actions">
                  <Link href="/register" className="landing-btn-hero group">
                    <span>Daftar Sekarang — Gratis</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="landing-logo">
              <div className="landing-logo-icon">
                <Star className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <span className="landing-logo-text">StarReport</span>
            </div>
            <p className="landing-footer-tagline">
              Platform pelaporan masyarakat yang transparan dan terpercaya.
            </p>
          </div>
          <div className="landing-footer-links">
            <Link href="/login" className="landing-footer-link">Masuk</Link>
            <Link href="/register" className="landing-footer-link">Daftar</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>© 2026 StarReport. Hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>
    </div>
  );
}
