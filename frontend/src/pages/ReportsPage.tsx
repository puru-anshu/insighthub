import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { EmptyState, LoadingSpinner, PageHeader } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import type { Report } from '@/types';

async function fetchReports(): Promise<Report[]> {
  const { data } = await apiClient.get('/reports');
  return data.data ?? data;
}

export default function ReportsPage() {
  const {
    data: reports,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Manage report definitions"
        actions={
          <button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Report
          </button>
        }
      />

      {isLoading && <LoadingSpinner size="lg" className="mt-12" />}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load reports. Make sure the backend is running.
        </div>
      )}

      {!isLoading && !error && (!reports || reports.length === 0) && (
        <EmptyState
          title="No reports found"
          description="Create your first report to get started."
          action={
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </button>
          }
        />
      )}

      {reports && reports.length > 0 && (
        <div className="card overflow-hidden p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {report.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {report.shortDescription || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        report.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {report.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button className="text-primary-600 hover:text-primary-800">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
