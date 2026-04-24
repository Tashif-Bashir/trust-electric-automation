import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { Skeleton } from '../ui/Skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: LucideIcon;
  loading?: boolean;
}

export function StatCard({ title, value, subtitle, trend, icon: Icon, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-dash-card border border-dash-border rounded-xl p-5">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  const trendPositive = trend !== undefined && trend >= 0;

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5 hover:border-brand-amber/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-dash-muted uppercase tracking-wide">{title}</p>
        <div className="w-9 h-9 rounded-lg bg-brand-amber/10 flex items-center justify-center">
          <Icon size={18} className="text-brand-amber" />
        </div>
      </div>

      <div className="mb-1">
        <span className="text-3xl font-bold text-dash-text font-serif">{value}</span>
      </div>

      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span
            className={clsx(
              'flex items-center gap-0.5 text-xs font-medium',
              trendPositive ? 'text-green-400' : 'text-red-400'
            )}
          >
            {trendPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {subtitle && <span className="text-xs text-dash-muted">{subtitle}</span>}
      </div>
    </div>
  );
}
