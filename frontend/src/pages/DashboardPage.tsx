import { BarChart3, Database, FileText, Users } from 'lucide-react';

import { PageHeader } from '@/components/ui';
import { useAuthStore } from '@/features/auth';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.fullName || user?.username || 'User'}`}
        description="Overview of your reporting environment"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Reports"
          value="—"
          icon={BarChart3}
          color="bg-blue-500"
        />
        <StatCard
          title="Datasources"
          value="—"
          icon={Database}
          color="bg-green-500"
        />
        <StatCard title="Users" value="—" icon={Users} color="bg-purple-500" />
        <StatCard
          title="Active Jobs"
          value="—"
          icon={FileText}
          color="bg-orange-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Reports
          </h2>
          <p className="text-sm text-gray-500">
            Report activity will appear here once connected to the backend.
          </p>
        </div>
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Job Status
          </h2>
          <p className="text-sm text-gray-500">
            Scheduled job status will appear here once connected to the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
