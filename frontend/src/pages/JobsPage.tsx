import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { EmptyState, LoadingSpinner, PageHeader } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import type { Job } from '@/types';

async function fetchJobs(): Promise<Job[]> {
  const { data } = await apiClient.get('/jobs');
  return data.data ?? data;
}

export default function JobsPage() {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage scheduled report jobs"
        actions={
          <button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </button>
        }
      />

      {isLoading && <LoadingSpinner size="lg" className="mt-12" />}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load jobs. Make sure the backend is running.
        </div>
      )}

      {!isLoading && !error && (!jobs || jobs.length === 0) && (
        <EmptyState
          title="No jobs found"
          description="Schedule report jobs for automated delivery."
          action={
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </button>
          }
        />
      )}

      {jobs && jobs.length > 0 && (
        <div className="card overflow-hidden p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Run
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {jobs.map((job) => (
                <tr key={job.jobId} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {job.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        job.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {job.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {job.lastRunDate || '—'}
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
