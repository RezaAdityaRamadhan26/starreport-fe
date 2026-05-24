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
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          {isAdmin
            ? 'Ringkasan statistik laporan masyarakat.'
            : `Halo, ${user?.username}. Berikut ringkasan laporan Anda.`}
        </p>
      </div>

      {/* Admin Stats — Bento Grid */}
      {isAdmin && (
        <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: 'Total Laporan',
              value: totalReports,
              icon: FileText,
              iconBg: 'bg-input-bg',
              iconColor: 'text-muted',
            },
            {
              label: 'Menunggu',
              value: getStatValue('pending'),
              icon: Clock,
              iconBg: 'bg-yellow-50',
              iconColor: 'text-yellow-600',
            },
            {
              label: 'Disetujui',
              value: getStatValue('approved'),
              icon: CheckCircle,
              iconBg: 'bg-emerald-50',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Ditolak',
              value: getStatValue('rejected'),
              icon: XCircle,
              iconBg: 'bg-red-50',
              iconColor: 'text-red-500',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="animate-fade-up card-base rounded-2xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted/80">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`h-[18px] w-[18px] ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User quick stats */}
      {!isAdmin && (
        <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Total Laporan',
              value: myReports.length,
              icon: FileText,
              iconBg: 'bg-input-bg',
              iconColor: 'text-muted',
            },
            {
              label: 'Sedang Diproses',
              value: myReports.filter((r) => r.status === 'pending').length,
              icon: TrendingUp,
              iconBg: 'bg-yellow-50',
              iconColor: 'text-yellow-600',
            },
            {
              label: 'Ditolak',
              value: myReports.filter((r) => r.status === 'rejected').length,
              icon: AlertTriangle,
              iconBg: 'bg-red-50',
              iconColor: 'text-red-500',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="animate-fade-up card-base rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted/80">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent reports */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">
            {isAdmin ? 'Laporan Terbaru' : 'Laporan Saya'}
          </h2>
          {myReports.length > 4 && (
            <a href="/dashboard/my-reports" className="text-[13px] font-medium text-emerald-600 hover:text-emerald-700">
              Lihat semua →
            </a>
          )}
        </div>

        {myReports.length === 0 ? (
          <div className="card-base flex flex-col items-center justify-center rounded-2xl py-16">
            <FileText className="mb-3 h-10 w-10 text-muted/50" />
            <p className="text-sm font-medium text-muted/80">Belum ada laporan</p>
            <a
              href="/dashboard/reports/create"
              className="mt-3 text-[13px] font-medium text-emerald-600 hover:text-emerald-700"
            >
              Buat laporan pertama →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {myReports.slice(0, 4).map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
