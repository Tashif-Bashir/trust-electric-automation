import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStats } from '../../hooks/useStats';
import { Skeleton } from '../ui/Skeleton';
import type { LeadStatus } from '../../types/lead';

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3b82f6',
  contacted: '#8b5cf6',
  qualified: '#f59e0b',
  quoted: '#ea580c',
  converted: '#10b981',
  lost: '#ef4444',
};

export function StatusDistribution() {
  const { data, isLoading } = useStats();

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const chartData = Object.entries(data?.by_status ?? {})
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: STATUS_COLORS[status as LeadStatus],
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-dash-card border border-dash-border rounded-xl p-5 flex items-center justify-center h-64">
        <p className="text-dash-muted text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-dash-text mb-4">Lead Status Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="40%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#14141f',
              border: '1px solid #1e1e32',
              borderRadius: 8,
              fontSize: 12,
              color: '#f5f1ec',
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
