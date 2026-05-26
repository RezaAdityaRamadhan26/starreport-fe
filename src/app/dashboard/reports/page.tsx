'use client';

import { useEffect, useState, useCallback } from 'react';
import { getReports } from '@/services/reportService';
import { getCategories } from '@/services/categoryService';
import type { Report, Category, ReportFilters } from '@/lib/types';
import ReportCard from '@/components/ReportCard';
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({ page: 1, limit: 9 });
  const [search, setSearch] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReports({ ...filters, search: search || undefined });
      if (res.success && res.data) setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1 }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="ds-page-header">
        <h1 className="ds-page-title">Semua Laporan</h1>
        <p className="ds-page-subtitle">Telusuri semua laporan masyarakat.</p>
      </div>

      {/* Filters */}
      <div className="ds-filter-bar">
        <form onSubmit={handleSearch} className="ds-search-wrap">
          <Search className="h-4 w-4 ds-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari laporan..."
            className="ds-search-input"
            id="search-reports"
          />
        </form>

        <select
          value={filters.status || ''}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
          className="ds-select"
          id="filter-status"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>

        <select
          value={filters.category_id || ''}
          onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value || undefined, page: 1 }))}
          className="ds-select"
          id="filter-category"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="ds-spinner">
          <div className="ds-spinner-ring" />
        </div>
      ) : reports.length === 0 ? (
        <div className="ds-empty">
          <FileText className="h-10 w-10 ds-empty-icon" />
          <p className="ds-empty-text">Tidak ada laporan ditemukan</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
            Coba ubah filter pencarian Anda.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {reports.length > 0 && (
        <div className="ds-pagination">
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
            disabled={filters.page === 1}
            className="ds-pagination-btn"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
          </button>
          <span className="ds-pagination-current">
            {filters.page || 1}
          </span>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            disabled={reports.length < (filters.limit || 9)}
            className="ds-pagination-btn"
          >
            Selanjutnya <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
