import { Clock, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { LeadsOverTime } from '../components/charts/LeadsOverTime';
import { PropertyTypeChart } from '../components/charts/PropertyTypeChart';
import { StatusDistribution } from '../components/charts/StatusDistribution';
import { StatCard } from '../components/stats/StatCard';
import { StatusBadge } from '../components/leads/StatusBadge';
import { useLeads } from '../hooks/useLeads';
import { useStats } from '../hooks/useStats';
import { Skeleton } from '../components/ui/Skeleton';

export function Overview() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ page_size: 10 });
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats?.total_leads ?? 0}
          icon={Users}
          subtitle="all time"
          loading={statsLoading}
        />
        <StatCard
          title="New This Week"
          value={stats?.leads_this_week ?? 0}
          icon={UserPlus}
          subtitle="last 7 days"
          loading={statsLoading}
        />
        <StatCard
          title="Conversion Rate"
          value={`${(stats?.conversion_rate ?? 0).toFixed(1)}%`}
          icon={TrendingUp}
          subtitle="new → converted"
          loading={statsLoading}
        />
        <StatCard
          title="Avg Response"
          value={
            stats
              ? stats.average_response_time_hours < 1
                ? `${Math.round(stats.average_response_time_hours * 60)}m`
                : `${stats.average_response_time_hours.toFixed(1)}h`
              : '—'
          }
          icon={Clock}
          subtitle="time to contact"
          loading={statsLoading}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <LeadsOverTime />
        </div>
        <StatusDistribution />
      </div>

      {/* Charts row 2 + recent leads */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1">
          <PropertyTypeChart />
        </div>

        {/* Recent leads */}
        <div className="xl:col-span-2 bg-dash-card border border-dash-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dash-text">Recent Leads</h3>
            <button
              onClick={() => navigate('/leads')}
              className="text-xs text-brand-amber hover:underline"
            >
              View all →
            </button>
          </div>

          {leadsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : leadsData?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users size={36} className="text-dash-border mb-3" />
              <p className="text-sm text-dash-muted">No leads yet — share your landing page to start capturing leads!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-dash-muted border-b border-dash-border">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Postcode</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 font-medium">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border/50">
                  {leadsData?.items.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/3 cursor-pointer transition-colors"
                      onClick={() => navigate(`/leads?selected=${lead.id}`)}
                    >
                      <td className="py-2.5 pr-4 font-medium text-dash-text">{lead.full_name}</td>
                      <td className="py-2.5 pr-4 text-dash-muted">{lead.postcode}</td>
                      <td className="py-2.5 pr-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="py-2.5 text-dash-muted text-xs">
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
