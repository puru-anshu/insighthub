import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/ui';

export default function DatasourcesPage() {
  return (
    <div>
      <PageHeader
        title="Datasources"
        description="Manage database connections and data sources"
        actions={
          <button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Datasource
          </button>
        }
      />

      <div className="card">
        <p className="text-sm text-gray-500">
          Datasource management will be implemented as the API endpoints are
          extended. This page will allow creating, editing, and testing database
          connections.
        </p>
      </div>
    </div>
  );
}
