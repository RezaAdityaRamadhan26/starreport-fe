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
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Semua Laporan</h1>
        <p className="mt-1 text-sm text-muted">Telusuri semua laporan masyarakat.</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <form onSubmit={handleSearch} className="relative md:col-span-6 lg:col-span-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/80" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari laporan..."
            className="input-base"
            style={{ paddingLeft: '2.5rem' }}
            id="search-reports"
          />
        </form>

        <select
          value={filters.status || ''}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
          className="input-base md:col-span-3 lg:col-span-2"
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
          className="input-base md:col-span-3 lg:col-span-2"
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
        <div className="flex h-64 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-emerald-500 border-t-transparent" />
        </div>
      ) : reports.length === 0 ? (
        <div className="card-base flex flex-col items-center justify-center rounded-2xl py-20">
          <FileText className="mb-3 h-10 w-10 text-muted/50" />
          <p className="text-sm font-medium text-muted">Tidak ada laporan ditemukan</p>
          <p className="mt-1 text-[13px] text-muted/80">Coba ubah filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <div key={report.id} className="animate-fade-up">
              <ReportCard report={report} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {reports.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
            disabled={filters.page === 1}
            className="btn-ghost gap-1 rounded-lg px-3 py-1.5 text-[13px] disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
          </button>
          <span className="rounded-lg bg-emerald-50 px-3.5 py-1.5 text-[13px] font-medium text-emerald-700">
            {filters.page || 1}
          </span>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            disabled={reports.length < (filters.limit || 9)}
            className="btn-ghost gap-1 rounded-lg px-3 py-1.5 text-[13px] disabled:opacity-40"
          >
            Selanjutnya <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
