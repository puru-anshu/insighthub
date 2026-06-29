# InsightHub

A modern Reporting & Business Intelligence platform — React + TypeScript frontend with a Spring Boot 3 backend.

## Project Structure

```
insighthub/
├── frontend/       # React 18 + TypeScript + Vite + Tailwind
├── backend/        # Spring Boot 3 + Java 17 + JPA + JWT
├── docker/         # Docker & Compose configs (coming soon)
├── docs/           # Feature catalog & architecture docs
└── README.md
```

## Quick Start

### Prerequisites

- **Backend**: Java 17 (`temurin-17`), Maven 3.9+
- **Frontend**: Node.js 18+, pnpm 9+

### Run Backend

```bash
cd backend
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
mvn spring-boot:run
```

Starts at `http://localhost:8080/insighthub`

### Run Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Starts at `http://localhost:3000` (proxies API calls to backend)

### Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin` | Super Admin |
| `user` | `user` | Viewer |

## Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/insighthub/api |
| Swagger UI | http://localhost:8080/insighthub/swagger-ui.html |
| H2 Console | http://localhost:8080/insighthub/h2-console |

## Tech Stack

### Frontend
- React 18 + TypeScript 5.5
- Vite 5 (bundler) + pnpm (package manager)
- Tailwind CSS 3.4
- React Router v6, TanStack Query, Zustand
- React Hook Form + Zod
- Recharts, TanStack Table

### Backend
- Spring Boot 3.3 (Java 17)
- Spring Security + JWT (jjwt)
- Spring Data JPA + Hibernate
- Flyway (database migrations)
- H2 (dev) / PostgreSQL (prod)
- SpringDoc OpenAPI 3

## Development Workflow

1. Create feature branch: `git checkout -b feat/datasource-management`
2. Develop backend + frontend together
3. Run both servers, test end-to-end
4. Commit with conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
5. Push and open PR

## Roadmap

| # | Feature | Status |
|---|---------|--------|
| 1 | User & Access Management | ✅ Done |
| 2 | Datasource Management | ⬜ Next |
| 3 | Report Groups | ⬜ Planned |
| 4 | Report Management | ⬜ Planned |
| 5 | Parameters | ⬜ Planned |
| 6 | Scheduling & Jobs | ⬜ Planned |
| 7 | Dashboards | ⬜ Planned |
| 8 | Charts | ⬜ Planned |
| 9 | Self-Service | ⬜ Planned |
| 10 | Docker & Kubernetes | ⬜ Planned |

## License

GNU General Public License v3.0
