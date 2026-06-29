import { apiClient } from '@/lib/api-client';

export interface Report {
  id: number;
  name: string;
  shortDescription?: string;
  description?: string;
  reportType: number;
  reportGroupId?: number;
  reportGroupName?: string;
  datasourceId?: number;
  datasourceName?: string;
  contactPerson?: string;
  active: boolean;
  hidden: boolean;
  defaultReportFormat?: string;
  reportSource?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReportPayload {
  name: string;
  shortDescription?: string;
  description?: string;
  reportType: number;
  reportGroupId?: number | null;
  datasourceId?: number | null;
  contactPerson?: string;
  active: boolean;
  reportSource?: string;
  defaultReportFormat?: string;
}

export interface RunReportResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionMs: number;
}

export async function fetchReports(): Promise<Report[]> {
  const { data } = await apiClient.get('/reports');
  return data;
}

export async function fetchReportById(id: number): Promise<Report> {
  const { data } = await apiClient.get(`/reports/${id}`);
  return data;
}

export async function createReport(
  payload: CreateReportPayload,
): Promise<Report> {
  const { data } = await apiClient.post('/reports', payload);
  return data;
}

export async function updateReport(
  id: number,
  payload: CreateReportPayload,
): Promise<Report> {
  const { data } = await apiClient.put(`/reports/${id}`, payload);
  return data;
}

export async function deleteReport(id: number): Promise<void> {
  await apiClient.delete(`/reports/${id}`);
}

export async function runReport(id: number): Promise<RunReportResult> {
  const { data } = await apiClient.post(`/reports/${id}/run`);
  return data;
}
