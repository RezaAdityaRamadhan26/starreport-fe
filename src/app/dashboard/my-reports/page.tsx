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
      <div className="ds-spinner">
        <div className="ds-spinner-ring" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="ds-page-header" style={{ marginBottom: 0 }}>
          <h1 className="ds-page-title">Laporan Saya</h1>
          <p className="ds-page-subtitle">
            {reports.length} laporan yang pernah Anda buat.
          </p>
        </div>
        <Link href="/dashboard/reports/create" className="auth-submit" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8125rem', borderRadius: '0.625rem' }}>
          + Buat Laporan
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="ds-empty">
          <FolderOpen className="h-10 w-10 ds-empty-icon" />
          <p className="ds-empty-text">Anda belum membuat laporan.</p>
          <Link href="/dashboard/reports/create" className="ds-empty-link">
            Buat laporan pertama →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
