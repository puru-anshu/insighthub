import { useMutation } from '@tanstack/react-query';
import { Play, X } from 'lucide-react';

import { LoadingSpinner } from '@/components/ui';

import { runReport, type Report, type RunReportResult } from './api';

interface Props {
  report: Report;
  onClose: () => void;
}

export function RunReportModal({ report, onClose }: Props) {
  const mutation = useMutation({
    mutationFn: () => runReport(report.id),
  });

  const result: RunReportResult | undefined = mutation.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {report.name}
            </h2>
            <p className="text-sm text-gray-500">
              {report.datasourceName || 'No datasource'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="btn-primary"
            >
              <Play className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-auto p-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {mutation.isPending && (
            <LoadingSpinner size="lg" className="py-12" />
          )}

          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {(mutation.error as Error).message || 'Failed to run report'}
            </div>
          )}

          {result && (
            <div>
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                <span>{result.rowCount} rows returned</span>
                <span>•</span>
                <span>{result.executionMs}ms</span>
              </div>

              {result.rows.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  Query returned no data.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {result.columns.map((col) => (
                          <th
                            key={col}
                            className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {result.columns.map((col) => (
                            <td
                              key={col}
                              className="whitespace-nowrap px-4 py-2 text-gray-600"
                            >
                              {row[col] != null ? String(row[col]) : '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!mutation.isPending && !mutation.isError && !result && (
            <p className="py-12 text-center text-gray-400">
              Click "Run" to execute this report.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
