import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'gray';
  className?: string;
}

const variants = {
  amber: 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30',
  green: 'bg-green-500/15 text-green-400 border border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
};

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
