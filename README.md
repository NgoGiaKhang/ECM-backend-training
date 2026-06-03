# Week Three API

> A production-ready backend application built with **Express.js**, **TypeScript**, and **Prisma ORM**, strictly following the **Modular Monolithic** architectural pattern.

---

## Introduction

This project is engineered to bridge the gap between a simple monolithic structure and a domain-centric, maintainable backend. By organizing the codebase into self-contained modules with a centralized shared layer, the system achieves **high cohesion, low coupling**, and a clear separation of concerns.

### Key Architectural Highlights

- **Modular Monolith Design:** Business logic is strictly encapsulated into independent domains (`modules`). This keeps the codebase maintainable and scalable.
- **Centralized Shared Layer (`shared`):** Cross-cutting concerns such as database connections, global error handling, logging, and shared utilities are centralized to eliminate duplication.
- **Type-Safe Database Operations:** Prisma ORM and TypeScript provide end-to-end type safety, automated migrations, and optimized database access.

## Tech Stack

### Core Technologies
| Component               | Technology / Library   | Description                                                          |
| :---------------------- | :--------------------- | :------------------------------------------------------------------- |
| **Runtime Environment** | Node.js (TypeScript)   | Strongly-typed, scalable asynchronous event-driven runtime.          |
| **Web Framework**       | Express (v5.x)         | Fast, unopinionated, minimalist web framework for Node.js.           |
| **Database ORM**        | Prisma Client & Driver | Type-safe ORM with PostgreSQL support and runtime schema validation. |

### Ecosystem & Dependencies

| Category                | Libraries                                              | Purpose                                                        |
| :---------------------- | :----------------------------------------------------- | :------------------------------------------------------------- |
| **Database**            | `pg`, `@prisma/adapter-pg`                             | PostgreSQL client and Prisma adapter.                          |
| **Security & Auth**     | `jsonwebtoken`, `bcrypt`, `cors`                       | JWT authentication, secure password hashing, and CORS support. |
| **Rate Limiting**       | `express-rate-limit`                                   | Protects public endpoints from repeated or abusive requests.   |
| **Validation**          | `zod`                                                  | Schema validation and type-safe runtime parsing.               |
| **Documentation**       | `swagger-ui-express`, `@asteasolutions/zod-to-openapi` | Auto-generated API docs from Zod schemas.                      |
| **Caching & Utilities** | `node-cache`, `ms`                                     | In-memory caching and time string parsing utilities.           |
| **Logging**             | `pino`                                                 | Fast JSON-based logger for production telemetry.               |
| **Environment**         | `dotenv`                                               | Loads `.env` variables into `process.env`.                     |

## Architecture & Project Structure

This application follows a **Modular Monolithic** architecture. The codebase is partitioned into business domains (`modules`) and infrastructure concerns (`shared`).

### Directory Layout

```text
├── prisma/                  # Prisma schema, migrations, and seed scripts
├── src/
│   ├── generated/           # Auto-generated artifacts (Prisma client, OpenAPI types)
│   ├── modules/             # Business domains / Feature modules
│   ├── shared/              # Core infrastructure and cross-cutting contracts
│   │   ├── auth/            # Authentication middleware, helpers, and auth contracts
│   │   ├── cache/           # Shared caching utilities and in-memory cache adapter
│   │   ├── database/        # Prisma client initialization and extensions
│   │   ├── docs/            # Swagger/OpenAPI configuration and documentation registry
│   │   ├── exception/       # Global exception types and error middleware
│   │   ├── http/            # API shapes, serializers, and validation helpers
│   │   ├── idempotency/     # Idempotent request middleware and helpers
│   │   ├── logger/          # Pino logger and request logging middleware
│   │   ├── middleware/      # Global Express middleware (CORS, rate limiting, etc.)
│   │   └── pagination/      # Pagination utilities and request helpers
│   ├── app.ts               # Express application configuration and middleware binding
│   ├── bootstrap.ts         # Pre-flight initialization and application startup orchestration
│   ├── env.ts               # Strongly-typed environment variable validation via Zod
│   ├── main.ts              # Server startup entrypoint
│   └── router.ts            # Global router wiring for module routes
└── test/                    # Vitest test suite and integration tests
```

### Core Layer Responsibilities

#### 1. The `shared/` Layer (Framework & Contracts)

The `shared` directory is the internal foundation that keeps business modules decoupled:

- `auth/` handles authentication contracts, JWT middleware, and authorized request extraction.
- `cache/` exposes a reusable cache contract and default in-memory implementation.
- `database/` initializes the Prisma client and applies Prisma extensions for application-wide behavior.
- `docs/` configures Swagger UI and generates OpenAPI docs from Zod schemas.
- `exception/` centralizes error classes and global exception handling.
- `http/` defines shared API response shapes, request validation helpers, and serialization logic.
- `idempotency/` supports idempotent request handling for safe retries.
- `logger/` provides structured telemetry and request logging.
- `middleware/` contains reusable Express middleware like CORS and rate limiting.
- `pagination/` standardizes pagination handling across endpoints.

#### 2. The `modules/` Layer (Encapsulated Bounded Contexts)

Each folder under `src/modules/` represents a distinct business domain with its own routes and services. Modules should focus on their own domain logic and depend only on the shared layer.

### Dependency Rules

This project enforces a strict dependency direction:

- `src/modules/*` may depend on `src/shared/*`
- `src/app.ts`, `src/main.ts`, and `src/router.ts` may depend on both `src/modules/*` and `src/shared/*`
- `src/shared/*` must not depend on `src/modules/*`
- `src/modules/*` should avoid importing deep internal files from other modules
- Cross-module interaction should happen through module public APIs only

### Module Boundary Rules

To keep feature boundaries strong and future-proof:

- **Public API Surface:** Each module exposes a single public API through its root `index.ts`.
- **Facade-based communication:** When one module needs another, it should use the target module’s public facade.
- **Database ownership:** Modules must not directly query or mutate tables owned by another module through Prisma.

### Dependency Diagram

```text
Dependency Direction

modules ─────► shared

modules ─────► modules
             (Facade / Events only)

shared  ✗────► modules
```

### Allowed

```ts
import { UserFacade } from "@/modules/users";
```

### Forbidden

```ts
import { UserService } from "@/modules/users/services/user.service";
```

## 2. Inter-Module Communication

Modules may communicate only through:

### Facades

High-level services exposed by the target module.

```text
Auth Module
     │
     ▼
UserFacade
     │
     ▼
Users Module
```

### Domain Events

Asynchronous event-driven communication.

```text
UserCreated Event
        │
        ▼
Subscribers
```

## API Endpoints

### Public Routes

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Authenticate and receive a JWT
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product details

### Protected Routes

- `GET /api/v1/brands`
- `GET /api/v1/categories`
- Other routes under `auth`, `brand`, `category`, and `product` modules require authentication

### Docs

- `GET /docs` - Swagger UI for API documentation

## Environment Variables

Required variables:

- `NODE_ENV` - `development`, `production`, or `test`
- `PORT` - Server port
- `APP_PREFIX` - API prefix, default `/api`
- `DATABASE_URL` - Prisma-compatible database connection string
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `JWT_ISSUER` - JWT issuer
- `JWT_AUDIENCE` - JWT audience
- `JWT_EXPIRES_IN` - Token lifetime (e.g. `15m`, `1h`, `7d`)
- `BCRYPT_SALT_ROUNDS` - Password hashing cost factor

Optional configuration:

- `CORS_ALLOWED_ORIGINS`
- `CORS_CREDENTIALS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`
- `DATABASE_POOL_MAX`
- `DATABASE_LOG_QUERY`

## Getting Started

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Open `http://localhost:8080/docs` to explore the API.

## Useful Scripts

- `pnpm dev` - Start development server with `tsx`
- `pnpm build` - Compile TypeScript sources
- `pnpm start` - Run compiled production build
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm prettier` - Check code formatting
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Apply migrations locally
- `pnpm prisma:reset` - Reset database and migrations
- `pnpm seed` - Run Prisma seed script

## Notes

- Global authentication middleware is configured in `src/app.ts`.
- Public routes are explicitly white-listed for unauthenticated access.
- API docs are served at `/docs`.
- Prisma schema and database migrations are managed under `prisma/`.
