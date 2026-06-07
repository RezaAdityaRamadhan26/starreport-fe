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
    diproses: {
      label: 'Diproses',
      className: 'ds-badge ds-badge-diproses',
      icon: <Clock className="h-3 w-3" />,
    },
    selesai: {
      label: 'Selesai',
      className: 'ds-badge ds-badge-selesai',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    ditolak: {
      label: 'Ditolak',
      className: 'ds-badge ds-badge-ditolak',
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
