import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { deleteUser, fetchUsers } from './api';
import { UserFormModal } from './UserFormModal';

import { EmptyState, LoadingSpinner, PageHeader } from '@/components/ui';
import type { User } from '@/types';

export function UsersPage() {
  const [modalUser, setModalUser] = useState<User | null | undefined>(
    undefined,
  );
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const handleDelete = (user: User) => {
    if (confirm(`Delete user "${user.username}"? This cannot be undone.`)) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage user accounts, access levels, and roles"
        actions={
          <button className="btn-primary" onClick={() => setModalUser(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>
        }
      />

      {isLoading && <LoadingSpinner size="lg" className="mt-12" />}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load users. Check backend connection.
        </div>
      )}

      {!isLoading && !error && (!users || users.length === 0) && (
        <EmptyState
          title="No users found"
          description="Create your first user to get started."
          action={
            <button className="btn-primary" onClick={() => setModalUser(null)}>
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
                  Roles
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
                  <td className="px-6 py-4 text-sm">
                    {user.roles && user.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No roles</span>
                    )}
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
                    <button
                      onClick={() => setModalUser(user)}
                      className="mr-3 text-primary-600 hover:text-primary-800"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
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

      {modalUser !== undefined && (
        <UserFormModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
        />
      )}
    </div>
  );
}
