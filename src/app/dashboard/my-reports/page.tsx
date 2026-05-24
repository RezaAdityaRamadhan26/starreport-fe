'use client';

import { useEffect, useState } from 'react';
import { getMyReports } from '@/services/reportService';
import type { Report } from '@/lib/types';
import ReportCard from '@/components/ReportCard';
import { FolderOpen } from 'lucide-react';
import Link from 'next/link';

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyReports();
        if (res.success && res.data) setReports(res.data);
      } catch (error) {
        console.error('Error fetching my reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Laporan Saya</h1>
          <p className="mt-1 text-sm text-muted">
            {reports.length} laporan yang pernah Anda buat.
          </p>
        </div>
        <Link href="/dashboard/reports/create" className="btn-primary rounded-lg text-[13px]">
          + Buat Laporan
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="card-base flex flex-col items-center justify-center rounded-2xl py-20">
          <FolderOpen className="mb-3 h-10 w-10 text-muted/50" />
          <p className="text-sm font-medium text-muted">Anda belum membuat laporan.</p>
          <Link
            href="/dashboard/reports/create"
            className="mt-3 text-[13px] font-medium text-emerald-600 hover:text-emerald-700"
          >
            Buat laporan pertama →
          </Link>
        </div>
      ) : (
        <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reports.map((report) => (
            <div key={report.id} className="animate-fade-up">
              <ReportCard report={report} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
