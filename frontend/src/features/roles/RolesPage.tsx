import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { deleteRole, fetchRoles, type Role } from './api';
import { RoleFormModal } from './RoleFormModal';

import { EmptyState, LoadingSpinner, PageHeader } from '@/components/ui';

export function RolesPage() {
  const [modalRole, setModalRole] = useState<Role | null | undefined>(
    undefined,
  );
  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted');
    },
    onError: () => toast.error('Failed to delete role'),
  });

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Define roles and assign permissions"
        actions={
          <button className="btn-primary" onClick={() => setModalRole(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </button>
        }
      />

      {isLoading && <LoadingSpinner size="lg" className="mt-12" />}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load roles.
        </div>
      )}

      {!isLoading && !error && (!roles || roles.length === 0) && (
        <EmptyState
          title="No roles defined"
          icon={<Shield className="h-12 w-12" />}
        />
      )}

      {roles && roles.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role.id} className="card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {role.name}
                </h3>
                <button
                  onClick={() => {
                    if (confirm(`Delete role "${role.name}"?`)) {
                      deleteMutation.mutate(role.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {role.description && (
                <p className="mb-3 text-sm text-gray-500">{role.description}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 5).map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                  >
                    {perm.replace(/_/g, ' ')}
                  </span>
                ))}
                {role.permissions.length > 5 && (
                  <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    +{role.permissions.length - 5} more
                  </span>
                )}
              </div>
              <button
                onClick={() => setModalRole(role)}
                className="mt-4 text-sm text-primary-600 hover:text-primary-800"
              >
                Edit permissions →
              </button>
            </div>
          ))}
        </div>
      )}

      {modalRole !== undefined && (
        <RoleFormModal
          role={modalRole}
          onClose={() => setModalRole(undefined)}
        />
      )}
    </div>
  );
}
