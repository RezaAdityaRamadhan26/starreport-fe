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
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <MapIcon className="h-6 w-6 text-emerald-500" />
          Peta Persebaran Laporan
        </h1>
        <p className="mt-1 text-sm text-muted">
          Lihat lokasi berbagai laporan masyarakat yang masuk.
        </p>
      </div>

      {/* Map Card */}
      <div className="card-base overflow-hidden rounded-2xl p-2">
        {loading ? (
          <div className="flex h-[600px] flex-col items-center justify-center gap-3 bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            <p className="text-sm font-medium text-muted">Memuat peta...</p>
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
            center={[-6.3956, 106.8166]} // Default center
          />
        )}
      </div>
    </div>
  );
}
