# InsightHub — Reporting & BI Platform (React + TypeScript Frontend)

Modern React/TypeScript frontend for InsightHub, a reporting and business intelligence platform.

## Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Language        | TypeScript 5.5           |
| Framework       | React 18                 |
| Build           | Vite 5                   |
| Package Manager | pnpm                     |
| Routing         | React Router v6          |
| State           | Zustand + TanStack Query |
| Styling         | Tailwind CSS 3.4         |
| Forms           | React Hook Form + Zod    |
| HTTP            | Axios                    |
| i18n            | react-i18next            |
| Charts          | Recharts                 |
| Tables          | TanStack Table           |
| Testing         | Vitest + Testing Library |
| Linting         | ESLint + Prettier        |
| Git Hooks       | Husky + lint-staged      |

## Prerequisites

- Node.js >= 18
- pnpm >= 9

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server (runs on port 3000)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint & format
pnpm lint
pnpm format
```

## Project Structure

```
insighthub-ui/
├── src/
│   ├── components/       # Shared UI components
│   │   ├── layout/       # App shell (Header, Sidebar, Layout)
│   │   └── ui/           # Reusable UI primitives
│   ├── features/         # Feature modules (auth, reports, users, etc.)
│   │   └── auth/         # Authentication (login, store, API)
│   ├── lib/              # Utilities and API client
│   ├── pages/            # Route-level page components
│   ├── routes/           # Router configuration
│   ├── styles/           # Global styles (Tailwind)
│   ├── types/            # Shared TypeScript types
│   └── test/             # Test utilities and setup
├── public/               # Static assets
├── .husky/               # Git hooks (pre-commit linting)
├── index.html            # Entry HTML
├── vite.config.ts        # Vite build config
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Backend Connection

The dev server proxies `/api/*` requests to `http://localhost:8080/insighthub`. Ensure the backend is running before testing API calls.

To override the API URL, create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/insighthub/api
```

## Development Workflow

### Daily Check-in Best Practices

1. **Feature branches**: Create a branch per feature/page (`feat/users-page`, `feat/report-builder`)
2. **Small commits**: Commit frequently with conventional commit messages
3. **Pre-commit hooks**: Husky runs ESLint + Prettier on staged files automatically
4. **Type safety**: `pnpm type-check` runs before push (add to CI)

### Commit Convention

```
feat: add users page with table and search
fix: resolve auth token refresh on 401
refactor: extract table component
chore: update dependencies
docs: add API integration guide
```

### CI Checklist (for each PR)

- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Migration Roadmap

| Phase          | Pages                                    | Status         |
| -------------- | ---------------------------------------- | -------------- |
| 1 - Foundation | Login, Layout, Auth                      | ✅ Done        |
| 2 - Admin      | Users, Datasources, Report Groups, Roles | 🚧 In Progress |
| 3 - Reports    | Report list, Run report, Parameters      | ⬜ Planned     |
| 4 - Jobs       | Job list, Create/Edit job, Schedules     | ⬜ Planned     |
| 5 - Dashboards | Dashboard viewer, Self-service builder   | ⬜ Planned     |
| 6 - Advanced   | Charts, OLAP, Maps, Pipelines            | ⬜ Planned     |

## License

GNU General Public License v3.0
