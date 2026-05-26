import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: {
      label: 'Menunggu',
      className: 'ds-badge ds-badge-pending',
      icon: <Clock className="h-3 w-3" />,
    },
    approved: {
      label: 'Disetujui',
      className: 'ds-badge ds-badge-approved',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    rejected: {
      label: 'Ditolak',
      className: 'ds-badge ds-badge-rejected',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const { label, className, icon } = config[status] || config.pending;

  return (
    <span className={className}>
      {icon}
      {label}
    </span>
  );
}
