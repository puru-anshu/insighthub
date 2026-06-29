import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Play, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { EmptyState, LoadingSpinner, PageHeader } from '@/components/ui';

import { deleteJob, executeJob, fetchJobs, type Job } from './api';
import { JobFormModal } from './JobFormModal';

export function JobsPage() {
  const [formJob, setFormJob] = useState<Job | null | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  const execMutation = useMutation({
    mutationFn: executeJob,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    },
    onError: () => toast.error('Execution failed'),
  });

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Schedule and manage automated report execution"
        actions={
          <button className="btn-primary" onClick={() => setFormJob(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </button>
        }
      />

      {isLoading && <LoadingSpinner size="lg" className="mt-12" />}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to load jobs.</div>
      )}

      {!isLoading && !error && (!jobs || jobs.length === 0) && (
        <EmptyState
          title="No jobs scheduled"
          description="Create a job to automate report delivery."
          icon={<Clock className="h-12 w-12" />}
        />
      )}

      {jobs && jobs.length > 0 && (
        <div className="card overflow-hidden p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Report</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{job.name}</div>
                    <div className="text-xs text-gray-500">{job.jobType}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{job.reportName || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {job.scheduleName ? (
                      <div>
                        <div>{job.scheduleName}</div>
                        <code className="text-xs text-gray-400">{job.cronExpression}</code>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      job.lastRunStatus === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                      job.lastRunStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.lastRunStatus || (job.active ? 'Active' : 'Inactive')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => execMutation.mutate(job.id)}
                      disabled={execMutation.isPending}
                      className="mr-2 text-green-600 hover:text-green-800"
                      title="Execute Now"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${job.name}"?`)) deleteMutation.mutate(job.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formJob !== undefined && (
        <JobFormModal job={formJob} onClose={() => setFormJob(undefined)} />
      )}
    </div>
  );
}
