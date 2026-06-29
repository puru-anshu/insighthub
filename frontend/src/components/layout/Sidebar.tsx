import {
  BarChart3,
  Calendar,
  Database,
  FolderOpen,
  KeyRound,
  LayoutDashboard,
  Layers,
  Lock,
  Mail,
  Settings,
  Shield,
  Users,
  Users2,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Report Groups', href: '/report-groups', icon: FolderOpen },
  { label: 'Dashboards', href: '/dashboards', icon: Layers },
  { label: 'Datasources', href: '/datasources', icon: Database },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'User Groups', href: '/user-groups', icon: Users2 },
  { label: 'Roles', href: '/roles', icon: Shield },
  { label: 'Access Rights', href: '/access-rights', icon: KeyRound },
  { label: 'Schedules', href: '/schedules', icon: Calendar },
  { label: 'Jobs', href: '/jobs', icon: Settings },
  { label: 'SMTP Servers', href: '/smtp-servers', icon: Mail },
  { label: 'Encryptors', href: '/encryptors', icon: Lock },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-primary-600">InsightHub</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-500">InsightHub v1.0</p>
      </div>
    </aside>
  );
}
