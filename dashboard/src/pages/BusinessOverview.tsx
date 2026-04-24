import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Briefcase,
  FileText,
  Package,
  Phone,
  PoundSterling,
  RefreshCw,
  Target,
  X,
} from 'lucide-react';
import {
  useMonthlyLeads,
  useUnleashedAlerts,
  useUnleashedProducts,
  useUnleashedStock,
  useUnleashedSummary,
  useXeroRevenue,
  useXeroStatus,
  useXeroSummary,
  useUnleashedStatus,
} from '../hooks/useIntegrations';
import { useLeads } from '../hooks/useLeads';
import { useStats } from '../hooks/useStats';
import { Skeleton } from '../components/ui/Skeleton';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
}

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(1)}k`;
  return fmt(n);
}

function pct(a: number, b: number): string {
  if (!b) return '—';
  const p = ((a - b) / b) * 100;
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`;
}

// ---------------------------------------------------------------------------
// Integration status banners
// ---------------------------------------------------------------------------

function IntegrationBanner({
  service,
  connected,
  mock,
  onDismiss,
}: {
  service: string;
  connected: boolean;
  mock: boolean;
  onDismiss: () => void;
}) {
  if (connected && !mock) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-brand-amber/10 border border-brand-amber/30 rounded-lg text-sm">
      <div className="flex items-center gap-2 text-brand-amber">
        <AlertTriangle size={14} />
        <span>
          {service} not connected — showing sample data.
        </span>
      </div>
      <button onClick={onDismiss} className="text-brand-amber/60 hover:text-brand-amber">
        <X size={14} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function MetricCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  alert,
  loading,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: string;
  alert?: boolean;
  loading?: boolean;
}) {
  return (
    <div className={`bg-dash-card border rounded-xl p-5 ${alert ? 'border-red-500/40' : 'border-dash-border'}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-dash-muted uppercase tracking-wide">{title}</p>
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-500/10' : 'bg-brand-amber/10'}`}>
          <Icon size={16} className={alert ? 'text-red-400' : 'text-brand-amber'} />
        </div>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-dash-text font-serif">{value}</p>
          {sub && <p className="text-xs text-dash-muted mt-1">{sub}</p>}
          {trend && (
            <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {trend} vs last month
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Revenue vs leads chart
// ---------------------------------------------------------------------------

function RevenueLeadsChart() {
  const { data: revenue, isLoading: rl } = useXeroRevenue(6);
  const { data: leads, isLoading: ll } = useMonthlyLeads(6);

  const isLoading = rl || ll;

  const combined = revenue?.map((r, i) => ({
    month: r.month,
    revenue: r.revenue,
    leads: leads?.[i]?.leads ?? 0,
  })) ?? [];

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-dash-text mb-4">Revenue vs Lead Volume</h3>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={combined}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtShort(v)} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#14141f', border: '1px solid #1e1e32', borderRadius: 8, fontSize: 12 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: unknown, name: unknown) => {
                const v = Number(value);
                return name === 'revenue' ? [fmt(v), 'Revenue'] : [v, 'Leads'];
              }) as any}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#e8833a" opacity={0.7} radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#d4a574" strokeWidth={2} dot={{ fill: '#d4a574', r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stock levels chart
// ---------------------------------------------------------------------------

function StockChart() {
  const { data: stock, isLoading } = useUnleashedStock();
  const { data: products } = useUnleashedProducts();

  const chartData = stock?.map((s) => {
    const prod = products?.find((p) => p.product_code === s.product_code);
    return {
      name: s.product_code,
      available: s.available_qty,
      allocated: s.allocated_qty,
      stockValue: prod ? Math.round(s.qty_on_hand * prod.last_cost) : 0,
      low: s.available_qty < 10,
    };
  }) ?? [];

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-dash-text mb-4">Stock Levels by Product</h3>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{ background: '#14141f', border: '1px solid #1e1e32', borderRadius: 8, fontSize: 12 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: unknown, name: unknown) => {
                const v = Number(value);
                return name === 'available' ? [v + ' units', 'Available'] : [v + ' units', 'Allocated'];
              }) as any}
            />
            <ReferenceLine x={10} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Reorder', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
            <Bar dataKey="available" name="available" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.low ? '#ef4444' : '#e8833a'} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline funnel
// ---------------------------------------------------------------------------

const AVG_DEAL = 1_500;

const PIPELINE_STAGES = [
  { key: 'new',       label: 'New',       prob: 0.15 },
  { key: 'contacted', label: 'Contacted', prob: 0.25 },
  { key: 'qualified', label: 'Qualified', prob: 0.45 },
  { key: 'quoted',    label: 'Quoted',    prob: 0.70 },
  { key: 'converted', label: 'Converted', prob: 1.00 },
];

function PipelineChart() {
  const { data: stats, isLoading } = useStats();

  const chartData = PIPELINE_STAGES.map((s) => ({
    name: s.label,
    count: stats?.by_status[s.key as keyof typeof stats.by_status] ?? 0,
    value: Math.round((stats?.by_status[s.key as keyof typeof stats.by_status] ?? 0) * AVG_DEAL * s.prob),
  }));

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-dash-text mb-1">Sales Pipeline Value</h3>
      <p className="text-xs text-dash-muted mb-4">Weighted by stage probability × £1,500 avg deal</p>
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtShort(v)} />
            <Tooltip
              contentStyle={{ background: '#14141f', border: '1px solid #1e1e32', borderRadius: 8, fontSize: 12 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: unknown, name: unknown) => {
                const v = Number(value);
                return name === 'value' ? [fmt(v), 'Pipeline Value'] : [v, 'Leads'];
              }) as any}
            />
            <Bar dataKey="value" name="value" fill="#e8833a" opacity={0.8} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Needs Attention panels
// ---------------------------------------------------------------------------

function OverdueInvoices() {
  const { data: summary, isLoading } = useXeroSummary();
  const overdue = summary?.outstanding?.overdue_invoices ?? [];

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={14} className="text-red-400" />
        <h3 className="text-sm font-semibold text-dash-text">Overdue Invoices</h3>
        {overdue.length > 0 && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded-full">
            {overdue.length}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : overdue.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-dash-muted text-sm">All invoices up to date!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {overdue.slice(0, 5).map((inv) => (
            <div key={inv.invoice_number} className="flex items-center justify-between gap-2 p-2.5 bg-dash-bg rounded-lg border border-dash-border">
              <div className="min-w-0">
                <p className="text-xs font-medium text-dash-text truncate">{inv.contact_name}</p>
                <p className="text-xs text-red-400">{inv.invoice_number}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-red-400">{fmt(inv.amount_due)}</p>
                <p className="text-xs text-dash-muted">overdue</p>
              </div>
            </div>
          ))}
          {overdue.length > 5 && (
            <p className="text-xs text-dash-muted text-center pt-1">+{overdue.length - 5} more</p>
          )}
        </div>
      )}
    </div>
  );
}

function LowStockAlerts() {
  const { data: alerts, isLoading } = useUnleashedAlerts();

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package size={14} className="text-brand-amber" />
        <h3 className="text-sm font-semibold text-dash-text">Low Stock Alerts</h3>
        {alerts && alerts.length > 0 && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-brand-amber/15 text-brand-amber border border-brand-amber/30 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : !alerts?.length ? (
        <div className="text-center py-6">
          <p className="text-dash-muted text-sm">Stock levels healthy</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((item) => (
            <div key={item.product_code} className="flex items-center justify-between gap-2 p-2.5 bg-dash-bg rounded-lg border border-brand-amber/20">
              <div className="min-w-0">
                <p className="text-xs font-medium text-dash-text truncate">{item.product_description}</p>
                <p className="text-xs text-dash-muted">{item.product_code}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-brand-amber">{item.available_qty} left</p>
                <button className="text-xs text-brand-amber/60 hover:text-brand-amber transition-colors">Reorder →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UncontactedLeads() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, isLoading } = useLeads({ status: 'new', page_size: 20 });

  const stale = data?.items.filter((l) => l.created_at < cutoff) ?? [];

  return (
    <div className="bg-dash-card border border-dash-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Phone size={14} className="text-red-400" />
        <h3 className="text-sm font-semibold text-dash-text">Uncontacted Leads</h3>
        {stale.length > 0 && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded-full">
            {stale.length}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : stale.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-dash-muted text-sm">All leads followed up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stale.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between gap-2 p-2.5 bg-dash-bg rounded-lg border border-red-500/20">
              <div className="min-w-0">
                <p className="text-xs font-medium text-dash-text truncate">{lead.full_name}</p>
                <p className="text-xs text-dash-muted">{lead.postcode}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-red-400">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</p>
                <a href={`tel:${lead.phone}`} className="text-xs text-brand-amber hover:underline">Call now</a>
              </div>
            </div>
          ))}
          {stale.length > 5 && (
            <p className="text-xs text-dash-muted text-center pt-1">+{stale.length - 5} more</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function BusinessOverview() {
  const [dismissedXero, setDismissedXero] = useState(false);
  const [dismissedUnleashed, setDismissedUnleashed] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: xeroStatus } = useXeroStatus();
  const { data: unleashedStatus } = useUnleashedStatus();
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useXeroSummary();
  const { data: stock, isLoading: stockLoading, refetch: refetchStock } = useUnleashedStock();
  const { data: products } = useUnleashedProducts();
  const { refetch: refetchUnleashed } = useUnleashedSummary();
  const { data: stats, isLoading: statsLoading } = useStats();

  function handleRefresh() {
    refetchSummary();
    refetchStock();
    refetchUnleashed();
    setLastRefresh(new Date());
  }

  // Compute stock value
  const totalStockValue = stock && products
    ? stock.reduce((sum, s) => {
        const prod = products.find((p) => p.product_code === s.product_code);
        return sum + (prod ? s.qty_on_hand * prod.last_cost : 0);
      }, 0)
    : 0;

  const activePipelineCount = stats
    ? (stats.by_status['new'] ?? 0) + (stats.by_status['contacted'] ?? 0) + (stats.by_status['qualified'] ?? 0)
    : 0;

  // Previous month revenue (second-to-last in array)
  const prevMonthRevenue = summary?.month_income ? summary.month_income * 0.85 : 0; // fallback estimate

  return (
    <div className="space-y-6">
      {/* Integration banners */}
      {!dismissedXero && (
        <IntegrationBanner
          service="Xero"
          connected={xeroStatus?.connected ?? false}
          mock={xeroStatus?.mock_mode ?? true}
          onDismiss={() => setDismissedXero(true)}
        />
      )}
      {!dismissedUnleashed && (
        <IntegrationBanner
          service="Unleashed"
          connected={unleashedStatus?.connected ?? false}
          mock={unleashedStatus?.mock_mode ?? true}
          onDismiss={() => setDismissedUnleashed(true)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-dash-text flex items-center gap-2">
            <Briefcase size={18} className="text-brand-amber" />
            Business Overview
          </h1>
          <p className="text-xs text-dash-muted mt-0.5">
            Last updated {formatDistanceToNow(lastRefresh, { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-dash-card border border-dash-border rounded-lg text-dash-muted hover:text-brand-amber hover:border-brand-amber/40 transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Revenue"
          value={summary ? fmtShort(summary.month_income) : '—'}
          sub={`Expenses: ${summary ? fmtShort(summary.month_expenses) : '—'}`}
          icon={PoundSterling}
          trend={summary ? pct(summary.month_income, prevMonthRevenue) : undefined}
          loading={summaryLoading}
        />
        <MetricCard
          title="Outstanding Invoices"
          value={summary ? fmtShort(summary.outstanding.total_outstanding) : '—'}
          sub={
            summary?.outstanding.overdue_count
              ? `${summary.outstanding.overdue_count} overdue (${fmtShort(summary.outstanding.overdue_amount)})`
              : 'None overdue'
          }
          icon={FileText}
          alert={
            !!summary?.outstanding.overdue_amount &&
            summary.outstanding.overdue_amount > summary.outstanding.total_outstanding * 0.1
          }
          loading={summaryLoading}
        />
        <MetricCard
          title="Stock Value"
          value={fmtShort(totalStockValue)}
          sub={stock ? `${stock.reduce((s, i) => s + i.qty_on_hand, 0)} units across ${stock.length} products` : undefined}
          icon={Package}
          alert={stock ? stock.some((s) => s.available_qty < 10) : false}
          loading={stockLoading}
        />
        <MetricCard
          title="Active Pipeline"
          value={String(activePipelineCount)}
          sub={`Est. ${fmtShort(activePipelineCount * AVG_DEAL * 0.3)} weighted value`}
          icon={Target}
          loading={statsLoading}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RevenueLeadsChart />
        <StockChart />
      </div>

      {/* Pipeline chart */}
      <PipelineChart />

      {/* Needs Attention */}
      <div>
        <h2 className="text-sm font-semibold text-dash-text mb-3">Needs Attention</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OverdueInvoices />
          <LowStockAlerts />
          <UncontactedLeads />
        </div>
      </div>
    </div>
  );
}
