import { Briefcase, LayoutDashboard, Mail, Settings, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/business', icon: Briefcase, label: 'Business', exact: false },
  { to: '/leads', icon: Users, label: 'Leads', exact: false },
  { to: '/emails', icon: Mail, label: 'Emails', exact: false },
  { to: '/settings', icon: Settings, label: 'Settings', exact: false },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-dash-card border-r border-dash-border z-50',
          'flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dash-border">
          <div>
            <div className="font-black text-2xl text-brand-amber font-sans leading-none tracking-tight">
              trust
            </div>
            <div className="text-[10px] text-dash-muted tracking-[2px] mt-0.5">
              Electric Heating
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-dash-muted hover:text-dash-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-amber/10 text-brand-amber border-l-2 border-brand-amber pl-[10px]'
                    : 'text-dash-muted hover:text-dash-text hover:bg-white/5'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-4 border-t border-dash-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-amber/20 flex items-center justify-center">
              <span className="text-brand-amber text-xs font-bold">ST</span>
            </div>
            <div>
              <p className="text-sm font-medium text-dash-text">Sales Team</p>
              <p className="text-xs text-dash-muted">Trust Electric</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
