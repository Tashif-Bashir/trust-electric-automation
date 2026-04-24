import type { LeadStatus } from '../../types/lead';
import { Badge } from '../ui/Badge';

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; variant: 'blue' | 'purple' | 'amber' | 'red' | 'green' | 'gray' }
> = {
  new: { label: 'New', variant: 'blue' },
  contacted: { label: 'Contacted', variant: 'purple' },
  qualified: { label: 'Qualified', variant: 'amber' },
  quoted: { label: 'Quoted', variant: 'gray' },
  converted: { label: 'Converted', variant: 'green' },
  lost: { label: 'Lost', variant: 'red' },
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, variant } = STATUS_CONFIG[status] ?? { label: status, variant: 'gray' as const };
  return (
    <Badge variant={variant}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}
