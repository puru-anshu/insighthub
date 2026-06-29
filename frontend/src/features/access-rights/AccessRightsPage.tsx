import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { LoadingSpinner, PageHeader } from '@/components/ui';
import { fetchReportGroups } from '@/features/report-groups/api';
import { fetchReports } from '@/features/reports/api';
import { fetchUserGroups } from '@/features/user-groups/api';
import { fetchUsers } from '@/features/users/api';

import {
  getUserGroupReportGroupRights,
  getUserGroupReportRights,
  getUserReportGroupRights,
  getUserReportRights,
  setUserGroupReportGroupRights,
  setUserGroupReportRights,
  setUserReportGroupRights,
  setUserReportRights,
} from './api';

type SubjectType = 'user' | 'userGroup';

export function AccessRightsPage() {
  const [subjectType, setSubjectType] = useState<SubjectType>('user');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [selectedReports, setSelectedReports] = useState<Set<number>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const { data: userGroups } = useQuery({ queryKey: ['user-groups'], queryFn: fetchUserGroups });
  const { data: reports } = useQuery({ queryKey: ['reports'], queryFn: fetchReports });
  const { data: reportGroups } = useQuery({ queryKey: ['report-groups'], queryFn: fetchReportGroups });

  // Load existing rights when subject changes
  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    const loadRights = async () => {
      try {
        if (subjectType === 'user') {
          const [rIds, gIds] = await Promise.all([
            getUserReportRights(subjectId),
            getUserReportGroupRights(subjectId),
          ]);
          setSelectedReports(new Set(rIds));
          setSelectedGroups(new Set(gIds));
        } else {
          const [rIds, gIds] = await Promise.all([
            getUserGroupReportRights(subjectId),
            getUserGroupReportGroupRights(subjectId),
          ]);
          setSelectedReports(new Set(rIds));
          setSelectedGroups(new Set(gIds));
        }
      } catch {
        toast.error('Failed to load rights');
      } finally {
        setLoading(false);
      }
    };
    loadRights();
  }, [subjectId, subjectType]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!subjectId) return;
      if (subjectType === 'user') {
        await setUserReportRights(subjectId, Array.from(selectedReports));
        await setUserReportGroupRights(subjectId, Array.from(selectedGroups));
      } else {
        await setUserGroupReportRights(subjectId, Array.from(selectedReports));
        await setUserGroupReportGroupRights(subjectId, Array.from(selectedGroups));
      }
    },
    onSuccess: () => toast.success('Access rights saved'),
    onError: () => toast.error('Failed to save'),
  });

  const toggleReport = (id: number) => {
    setSelectedReports((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleGroup = (id: number) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Access Rights"
        description="Assign reports and report groups to users or user groups"
      />

      {/* Subject selection */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Assign to</label>
            <select
              className="input-field"
              value={subjectType}
              onChange={(e) => { setSubjectType(e.target.value as SubjectType); setSubjectId(null); }}
            >
              <option value="user">User</option>
              <option value="userGroup">User Group</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">
              {subjectType === 'user' ? 'Select User' : 'Select User Group'}
            </label>
            <select
              className="input-field"
              value={subjectId ?? ''}
              onChange={(e) => setSubjectId(Number(e.target.value) || null)}
            >
              <option value="">Choose...</option>
              {subjectType === 'user'
                ? users?.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullName || u.username}</option>
                  ))
                : userGroups?.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner size="md" className="mt-8" />}

      {subjectId && !loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Report Groups */}
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <Shield className="h-4 w-4 text-primary-600" />
              Report Groups
            </h3>
            <p className="mb-3 text-xs text-gray-500">
              Granting access to a group gives access to all reports within it.
            </p>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {reportGroups?.map((g) => (
                <label key={g.id} className="flex items-center gap-2 rounded p-1 hover:bg-gray-50 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedGroups.has(g.id)}
                    onChange={() => toggleGroup(g.id)}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  {g.name}
                  <span className="ml-auto text-xs text-gray-400">{g.reportCount} reports</span>
                </label>
              ))}
            </div>
          </div>

          {/* Individual Reports */}
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <Shield className="h-4 w-4 text-green-600" />
              Individual Reports
            </h3>
            <p className="mb-3 text-xs text-gray-500">
              Grant access to specific reports (in addition to group-level access).
            </p>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {reports?.map((r) => (
                <label key={r.id} className="flex items-center gap-2 rounded p-1 hover:bg-gray-50 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedReports.has(r.id)}
                    onChange={() => toggleReport(r.id)}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  {r.name}
                  <span className="ml-auto text-xs text-gray-400">{r.reportGroupName}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {subjectId && !loading && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="btn-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save Access Rights'}
          </button>
        </div>
      )}
    </div>
  );
}
