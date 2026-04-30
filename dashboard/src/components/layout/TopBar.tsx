import { Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useLeads } from '../../hooks/useLeads';
import { subHours } from 'date-fns';

interface TopBarProps {
  onMenuClick: () => void;
  title: string;
}

export function TopBar({ onMenuClick, title }: TopBarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const oneHourAgo = subHours(now, 1).toISOString();
  const { data } = useLeads({ date_from: oneHourAgo, page_size: 100 });
  const recentCount = data?.total ?? 0;

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-dash-border bg-dash-card/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-dash-muted hover:text-dash-text hover:bg-white/5"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-semibold text-dash-text text-base">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-dash-muted hidden sm:block">
          {format(now, 'EEE d MMM, HH:mm')}
        </span>

        <div className="relative">
          <button className="p-2 rounded-lg text-dash-muted hover:text-dash-text hover:bg-white/5 relative">
            <Bell size={18} />
            {recentCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-amber" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
