import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

export interface CreateUserPayload {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  description?: string;
  accessLevel: number;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  description?: string;
  accessLevel?: number;
  active?: boolean;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get('/users');
  return data;
}

export async function fetchUserById(id: number): Promise<User> {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post('/users', payload);
  return data;
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  const { data } = await apiClient.put(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
