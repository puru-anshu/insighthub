import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { EmptyState, LoadingSpinner, PageHeader } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get('/users');
  return data.data ?? data;
}

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage user accounts"
        actions={
          <button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>
        }
      />

      {isLoading && <LoadingSpinner size="lg" className="mt-12" />}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load users. Make sure the backend is running.
        </div>
      )}

      {!isLoading && !error && (!users || users.length === 0) && (
        <EmptyState
          title="No users found"
          description="Add users to allow access to the system."
          action={
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </button>
          }
        />
      )}

      {users && users.length > 0 && (
        <div className="card overflow-hidden p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.fullName || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.active ? 'Active' : 'Inactive'}
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
