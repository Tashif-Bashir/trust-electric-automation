import { format, subDays } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useLeads } from '../../hooks/useLeads';
import { Skeleton } from '../ui/Skeleton';

function buildChartData(leads: { created_at: string }[]) {
  const counts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const key = format(subDays(new Date(), i), 'MMM d');
    counts[key] = 0;
  }
  leads.forEach((l) => {
    const key = format(new Date(l.created_at), 'MMM d');
    if (key in counts) counts[key]++;
  });
  return Object.entries(counts).map(([date, leads]) => ({ date, leads }));
}

export function LeadsOverTime() {
  const { data, isLoading } = useLeads({ page_size: 100 });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const chartData = buildChartData(data?.items ?? []);

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-dash-text mb-4">Leads — Last 30 Days</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e8833a" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#e8833a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              background: '#14141f',
              border: '1px solid #1e1e32',
              borderRadius: 8,
              fontSize: 12,
              color: '#f5f1ec',
            }}
            itemStyle={{ color: '#e8833a' }}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#e8833a"
            strokeWidth={2}
            fill="url(#amberGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#e8833a' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
