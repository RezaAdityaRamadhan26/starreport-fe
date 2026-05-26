'use client';

import Link from 'next/link';
import type { Report } from '@/lib/types';
import { UPLOADS_BASE_URL } from '@/lib/api';
import StatusBadge from './StatusBadge';
import { Calendar, MessageSquare, ArrowUpRight } from 'lucide-react';

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const formattedDate = new Date(report.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link href={`/dashboard/reports/${report.id}`} className="ds-report-card group">
      {/* Image */}
      {report.image && (
        <div className="ds-report-card-img">
          <img
            src={`${UPLOADS_BASE_URL}/${report.image}`}
            alt={report.header}
          />
          <div className="ds-report-card-badge">
            <StatusBadge status={report.status} />
          </div>
        </div>
      )}

      <div className="ds-report-card-body">
        {/* Status (if no image) */}
        {!report.image && (
          <div style={{ marginBottom: '0.75rem' }}>
            <StatusBadge status={report.status} />
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 className="ds-report-card-title">{report.header}</h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted/50 transition-all group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ marginTop: '0.125rem' }} />
        </div>

        {/* Body preview */}
        <p className="ds-report-card-excerpt">{report.body}</p>

        {/* Meta row */}
        <div className="ds-report-card-meta">
          <span className="ds-report-card-meta-item">
            {report.author_avatar ? (
              <img src={`${UPLOADS_BASE_URL}/${report.author_avatar}`} className="h-4 w-4 rounded-full object-cover" alt={report.author_name || 'User'} />
            ) : (
              <div className="ds-avatar" style={{ width: '1rem', height: '1rem', fontSize: '0.5rem' }}>
                {(report.author_name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontWeight: 500 }}>{report.author_name || 'Unknown'}</span>
          </span>
          <span className="ds-report-card-meta-item">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
          {report.total_comments !== undefined && (
            <span className="ds-report-card-meta-item">
              <MessageSquare className="h-3 w-3" />
              {report.total_comments}
            </span>
          )}
          <span className="ds-report-card-category">
            {report.category_name}
          </span>
        </div>
      </div>
    </Link>
  );
}
