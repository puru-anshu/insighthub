import { apiClient } from '@/lib/api-client';
import type { LoginRequest, LoginResponse } from '@/types';

export async function loginApi(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials,
  );
  return data;
}

export async function logoutApi(): Promise<void> {
  await apiClient.post('/logout');
}
