import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  createRole,
  fetchPermissions,
  updateRole,
  type Permission,
  type Role,
} from './api';

interface Props {
  role?: Role | null;
  onClose: () => void;
}

export function RoleFormModal({ role, onClose }: Props) {
  const isEdit = !!role;
  const queryClient = useQueryClient();
  const [name, setName] = useState(role?.name ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [selectedPerms, setSelectedPerms] = useState<Set<number>>(new Set());

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions,
  });

  // Initialize selected permissions from role on load
  const initPerms = (perms: Permission[]) => {
    if (role && selectedPerms.size === 0) {
      const ids = perms
        .filter((p) => role.permissions.includes(p.name))
        .map((p) => p.id);
      setSelectedPerms(new Set(ids));
    }
  };

  if (
    permissions &&
    role &&
    selectedPerms.size === 0 &&
    role.permissions.length > 0
  ) {
    initPerms(permissions);
  }

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        description,
        permissionIds: Array.from(selectedPerms),
      };
      return isEdit ? updateRole(role.id, payload) : createRole(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(isEdit ? 'Role updated' : 'Role created');
      onClose();
    },
    onError: () => toast.error('Failed to save role'),
  });

  const togglePerm = (id: number) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (permissions) setSelectedPerms(new Set(permissions.map((p) => p.id)));
  };

  const selectNone = () => setSelectedPerms(new Set());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Role' : 'Create Role'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Report Creator"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <input
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Permissions</label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-primary-600 hover:underline"
                >
                  All
                </button>
                <button
                  onClick={selectNone}
                  className="text-xs text-gray-500 hover:underline"
                >
                  None
                </button>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200 p-3">
              {permissions?.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedPerms.has(perm.id)}
                    onChange={() => togglePerm(perm.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">
                    {perm.name.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {selectedPerms.size} of {permissions?.length ?? 0} selected
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!name || mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
