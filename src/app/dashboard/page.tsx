'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getDashboardStats, getMyReports } from '@/services/reportService';
import type { DashboardStat, Report } from '@/lib/types';
import {
  Clock, CheckCircle, XCircle, FileText,
  TrendingUp, AlertTriangle,
} from 'lucide-react';
import ReportCard from '@/components/ReportCard';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const res = await getDashboardStats();
          if (res.success && res.data) setStats(res.data);
        }
        const myRes = await getMyReports();
        if (myRes.success && myRes.data) setMyReports(myRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const getStatValue = (status: string) =>
    stats.find((s) => s.status === status)?.total || 0;
  const totalReports = stats.reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <div className="ds-spinner">
        <div className="ds-spinner-ring" />
      </div>
    );
  }

  const statConfigs = isAdmin
    ? [
        { label: 'Total Laporan', value: totalReports, icon: FileText, bg: 'rgba(107,114,128,0.08)', color: '#6b7280' },
        { label: 'Menunggu', value: getStatValue('pending'), icon: Clock, bg: 'rgba(245,158,11,0.08)', color: '#f59e0b' },
        { label: 'Disetujui', value: getStatValue('approved'), icon: CheckCircle, bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
        { label: 'Ditolak', value: getStatValue('rejected'), icon: XCircle, bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
      ]
    : [
        { label: 'Total Laporan', value: myReports.length, icon: FileText, bg: 'rgba(107,114,128,0.08)', color: '#6b7280' },
        { label: 'Sedang Diproses', value: myReports.filter((r) => r.status === 'pending').length, icon: TrendingUp, bg: 'rgba(245,158,11,0.08)', color: '#f59e0b' },
        { label: 'Ditolak', value: myReports.filter((r) => r.status === 'rejected').length, icon: AlertTriangle, bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="ds-page-header">
        <h1 className="ds-page-title">Dashboard</h1>
        <p className="ds-page-subtitle">
          {isAdmin
            ? 'Ringkasan statistik laporan masyarakat.'
            : `Halo, ${user?.username}. Berikut ringkasan laporan Anda.`}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isAdmin ? 4 : 3}, 1fr)`, gap: '1rem' }}>
        {statConfigs.map((stat, i) => (
          <div key={i} className="ds-stat-card">
            <div className="ds-stat-header">
              <div>
                <p className="ds-stat-label">{stat.label}</p>
                <p className="ds-stat-value">{stat.value}</p>
              </div>
              <div className="ds-stat-icon" style={{ background: stat.bg }}>
                <stat.icon className="h-[18px] w-[18px]" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent reports */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--foreground)' }}>
            {isAdmin ? 'Laporan Terbaru' : 'Laporan Saya'}
          </h2>
          {myReports.length > 4 && (
            <Link href="/dashboard/my-reports" className="ds-empty-link" style={{ marginTop: 0 }}>
              Lihat semua →
            </Link>
          )}
        </div>

        {myReports.length === 0 ? (
          <div className="ds-empty">
            <FileText className="h-10 w-10 ds-empty-icon" />
            <p className="ds-empty-text">Belum ada laporan</p>
            <Link href="/dashboard/reports/create" className="ds-empty-link">
              Buat laporan pertama →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {myReports.slice(0, 4).map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
