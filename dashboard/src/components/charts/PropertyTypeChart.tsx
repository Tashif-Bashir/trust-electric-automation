import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useLeads } from '../../hooks/useLeads';
import { Skeleton } from '../ui/Skeleton';

function fmt(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PropertyTypeChart() {
  const { data, isLoading } = useLeads({ page_size: 100 });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  const counts: Record<string, number> = {};
  (data?.items ?? []).forEach((l) => {
    counts[l.property_type] = (counts[l.property_type] ?? 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([type, count]) => ({ type: fmt(type), count }))
    .sort((a, b) => b.count - a.count);

  if (chartData.length === 0) {
    return (
      <div className="bg-dash-card border border-dash-border rounded-xl p-5 flex items-center justify-center h-48">
        <p className="text-dash-muted text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-dash-text mb-4">Leads by Property Type</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={90} />
          <Tooltip
            contentStyle={{ background: '#14141f', border: '1px solid #1e1e32', borderRadius: 8, fontSize: 12, color: '#f5f1ec' }}
            itemStyle={{ color: '#e8833a' }}
          />
          <Bar dataKey="count" fill="#e8833a" radius={[0, 4, 4, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
