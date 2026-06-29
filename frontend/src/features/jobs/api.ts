import { apiClient } from '@/lib/api-client';

export interface Job {
  id: number;
  name: string;
  description?: string;
  reportId?: number;
  reportName?: string;
  scheduleId?: number;
  scheduleName?: string;
  cronExpression?: string;
  jobType: string;
  outputFormat?: string;
  recipients?: string;
  active: boolean;
  lastRunAt?: string;
  lastRunStatus?: string;
  lastRunMessage?: string;
  nextRunAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Schedule {
  id: number;
  name: string;
  description?: string;
  cronExpression: string;
  active: boolean;
}

export interface JobRunResult {
  success: boolean;
  message: string;
  executionMs: number;
}

export const JOB_TYPES = [
  'PUBLISH',
  'EMAIL_ATTACHMENT',
  'EMAIL_INLINE',
  'ALERT',
  'CONDITIONAL_EMAIL',
] as const;

export async function fetchJobs(): Promise<Job[]> {
  const { data } = await apiClient.get('/jobs');
  return data;
}

export async function createJob(payload: {
  name: string;
  description?: string;
  reportId: number;
  scheduleId?: number | null;
  jobType: string;
  outputFormat?: string;
  recipients?: string;
  active: boolean;
}): Promise<Job> {
  const { data } = await apiClient.post('/jobs', payload);
  return data;
}

export async function updateJob(
  id: number,
  payload: Parameters<typeof createJob>[0],
): Promise<Job> {
  const { data } = await apiClient.put(`/jobs/${id}`, payload);
  return data;
}

export async function deleteJob(id: number): Promise<void> {
  await apiClient.delete(`/jobs/${id}`);
}

export async function executeJob(id: number): Promise<JobRunResult> {
  const { data } = await apiClient.post(`/jobs/${id}/execute`);
  return data;
}

export async function fetchSchedules(): Promise<Schedule[]> {
  const { data } = await apiClient.get('/schedules');
  return data;
}
