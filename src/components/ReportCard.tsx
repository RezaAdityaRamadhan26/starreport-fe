'use client';

import Link from 'next/link';
import type { Report } from '@/lib/types';
import { UPLOADS_BASE_URL } from '@/lib/api';
import StatusBadge from './StatusBadge';
import { Calendar, User, MessageSquare, ArrowUpRight } from 'lucide-react';

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
    <Link
      href={`/dashboard/reports/${report.id}`}
      className="group card-base card-hover block overflow-hidden rounded-2xl"
    >
      {/* Image */}
      {report.image && (
        <div className="relative h-44 overflow-hidden bg-input-bg">
          <img
            src={`${UPLOADS_BASE_URL}/${report.image}`}
            alt={report.header}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute right-3 top-3">
            <StatusBadge status={report.status} />
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Status (if no image) */}
        {!report.image && (
          <div className="mb-3">
            <StatusBadge status={report.status} />
          </div>
        )}

        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {report.header}
          </h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted/50 transition-all group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Body preview */}
        <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-2">
          {report.body}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted/80">
          <span className="inline-flex items-center gap-1.5">
            {report.author_avatar ? (
              <img src={`${UPLOADS_BASE_URL}/${report.author_avatar}`} className="h-4 w-4 rounded-full object-cover" alt={report.author_name || 'User'} />
            ) : (
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[8px] font-bold text-muted">
                {(report.author_name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-muted">{report.author_name || 'Unknown'}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
          {report.total_comments !== undefined && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {report.total_comments}
            </span>
          )}
          <span className="ml-auto rounded-full bg-input-bg px-2 py-0.5 text-[11px] font-medium text-muted">
            {report.category_name}
          </span>
        </div>
      </div>
    </Link>
  );
}
