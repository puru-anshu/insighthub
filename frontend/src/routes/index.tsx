import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';

import { AppLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui';
import { LoginPage } from '@/features/auth';

// Lazy-loaded pages for code splitting
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const JobsPage = lazy(() => import('@/pages/JobsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Feature pages (full module)
const UsersPageWrapper = lazy(() =>
  import('@/features/users').then((m) => ({ default: m.UsersPage })),
);
const RolesPageWrapper = lazy(() =>
  import('@/features/roles').then((m) => ({ default: m.RolesPage })),
);
const DatasourcesPageWrapper = lazy(() =>
  import('@/features/datasources').then((m) => ({
    default: m.DatasourcesPage,
  })),
);

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="mt-20" />}>
      {children}
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <LazyPage>
              <DashboardPage />
            </LazyPage>
          }
        />
        <Route
          path="reports"
          element={
            <LazyPage>
              <ReportsPage />
            </LazyPage>
          }
        />
        <Route
          path="users"
          element={
            <LazyPage>
              <UsersPageWrapper />
            </LazyPage>
          }
        />
        <Route
          path="roles"
          element={
            <LazyPage>
              <RolesPageWrapper />
            </LazyPage>
          }
        />
        <Route
          path="datasources"
          element={
            <LazyPage>
              <DatasourcesPageWrapper />
            </LazyPage>
          }
        />
        <Route
          path="jobs"
          element={
            <LazyPage>
              <JobsPage />
            </LazyPage>
          }
        />
        <Route
          path="*"
          element={
            <LazyPage>
              <NotFoundPage />
            </LazyPage>
          }
        />
      </Route>
    </Routes>
  );
}
