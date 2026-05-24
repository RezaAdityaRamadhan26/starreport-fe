import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: {
      label: 'Menunggu',
      className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      icon: <Clock className="h-3 w-3" />,
    },
    approved: {
      label: 'Disetujui',
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    rejected: {
      label: 'Ditolak',
      className: 'bg-red-50 text-red-600 border border-red-200',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const { label, className, icon } = config[status] || config.pending;

  return (
    <span className={`pill ${className}`}>
      {icon}
      {label}
    </span>
  );
}
