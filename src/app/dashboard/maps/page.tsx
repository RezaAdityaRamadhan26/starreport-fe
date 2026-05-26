'use client';

import { useEffect, useState } from 'react';
import { getReports } from '@/services/reportService';
import type { Report } from '@/lib/types';
import { Map as MapIcon, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function MapExplorerPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const res = await getReports();
        if (res.success && res.data) {
          const validReports = res.data.filter((r) => r.latitude && r.longitude);
          setReports(validReports);
        }
      } catch (error) {
        console.error('Failed to fetch reports for map', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="ds-page-header">
        <h1 className="ds-page-title ds-page-title-icon">
          <MapIcon className="h-6 w-6" style={{ color: '#10b981' }} />
          Peta Persebaran Laporan
        </h1>
        <p className="ds-page-subtitle">
          Lihat lokasi berbagai laporan masyarakat yang masuk.
        </p>
      </div>

      {/* Map Card */}
      <div className="ds-card" style={{ overflow: 'hidden', padding: '0.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '600px', background: 'var(--background)', borderRadius: '0.75rem' }}>
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#10b981' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>Memuat peta...</p>
          </div>
        ) : (
          <MapComponent
            markers={reports.map((r) => ({
              id: r.id,
              latitude: Number(r.latitude),
              longitude: Number(r.longitude),
              title: r.header,
              category: r.category_name,
            }))}
            height="600px"
            zoom={13}
            center={[-6.3956, 106.8166]}
          />
        )}
      </div>
    </div>
  );
}
