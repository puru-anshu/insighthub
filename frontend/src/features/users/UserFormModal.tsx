import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { createUser, updateUser } from './api';

import type { User } from '@/types';

const createSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50),
  password: z.string().min(4, 'Min 4 characters').max(100),
  fullName: z.string().max(100).optional(),
  email: z
    .string()
    .email('Invalid email')
    .max(100)
    .or(z.literal(''))
    .optional(),
  description: z.string().max(500).optional(),
  accessLevel: z.coerce.number().min(0).max(100),
});

type CreateFormData = z.infer<typeof createSchema>;

interface Props {
  user?: User | null;
  onClose: () => void;
}

export function UserFormModal({ user, onClose }: Props) {
  const isEdit = !!user;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: isEdit
      ? {
          username: user.username,
          password: 'placeholder', // not used for edits
          fullName: user.fullName ?? '',
          email: user.email ?? '',
          description: user.description ?? '',
          accessLevel: user.accessLevel,
        }
      : { accessLevel: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateFormData) => {
      if (isEdit) {
        return updateUser(user.id, {
          fullName: data.fullName,
          email: data.email,
          description: data.description,
          accessLevel: data.accessLevel,
        });
      }
      return createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isEdit ? 'User updated' : 'User created');
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? 'Failed to update user' : 'Failed to create user');
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit User' : 'Create User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          {!isEdit && (
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                id="username"
                className="input-field"
                {...register('username')}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
          )}

          {!isEdit && (
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="label">
              Full Name
            </label>
            <input
              id="fullName"
              className="input-field"
              {...register('fullName')}
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="accessLevel" className="label">
              Access Level
            </label>
            <select
              id="accessLevel"
              className="input-field"
              {...register('accessLevel')}
            >
              <option value={0}>Normal User (0)</option>
              <option value={5}>Schedule User (5)</option>
              <option value={10}>Junior Admin (10)</option>
              <option value={30}>Mid Admin (30)</option>
              <option value={40}>Standard Admin (40)</option>
              <option value={80}>Senior Admin (80)</option>
              <option value={100}>Super Admin (100)</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              className="input-field"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
