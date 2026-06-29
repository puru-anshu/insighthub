import { apiClient } from '@/lib/api-client';

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await apiClient.get('/roles');
  return data;
}

export async function fetchPermissions(): Promise<Permission[]> {
  const { data } = await apiClient.get('/permissions');
  return data;
}

export async function createRole(payload: {
  name: string;
  description?: string;
  permissionIds: number[];
}): Promise<Role> {
  const { data } = await apiClient.post('/roles', payload);
  return data;
}

export async function updateRole(
  id: number,
  payload: { name: string; description?: string; permissionIds: number[] },
): Promise<Role> {
  const { data } = await apiClient.put(`/roles/${id}`, payload);
  return data;
}

export async function deleteRole(id: number): Promise<void> {
  await apiClient.delete(`/roles/${id}`);
}
