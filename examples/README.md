# @khannara/next-rbac Examples

This directory contains example applications demonstrating how to use `@khannara/next-rbac` in different scenarios.

## Available Examples

### 1. Basic MongoDB Example
- **Directory**: `basic-mongodb/`
- **Database**: MongoDB (direct connection)
- **Features**:
  - Server-side permission checks
  - React permission gates
  - Role-based access control
  - Basic RBAC setup

### 2. Prisma PostgreSQL Example
- **Directory**: `prisma-postgresql/`
- **Database**: PostgreSQL via Prisma
- **Features**:
  - Prisma adapter usage
  - Database migrations
  - Hierarchical roles
  - Middleware protection

### 3. Prisma MySQL Example
- **Directory**: `prisma-mysql/`
- **Database**: MySQL via Prisma
- **Features**:
  - MySQL-specific setup
  - Type-safe permissions
  - Module augmentation

### 4. In-Memory Testing Example
- **Directory**: `in-memory-testing/`
- **Database**: None (in-memory)
- **Features**:
  - Unit testing setup
  - Jest configuration
  - Mocking strategies
  - Test patterns

### 5. Complete SaaS Example
- **Directory**: `complete-saas/`
- **Database**: PostgreSQL (Prisma)
- **Features**:
  - Multi-tenant RBAC
  - Organization-based permissions
  - Invite system
  - Admin dashboard
  - User management
  - API routes with RBAC
  - Middleware protection
  - Role inheritance

## Quick Start

Each example includes:
- Complete Next.js application
- `.env.example` file with required variables
- Database schema/migrations
- Seed data
- README with setup instructions
- TypeScript configuration

## Running an Example

```bash
# Navigate to an example
cd examples/basic-mongodb

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your database credentials

# Run database migrations (if applicable)
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## Common Setup

All examples use:
- **Next.js 14+** - App Router
- **TypeScript** - Full type safety
- **@khannara/next-rbac** - RBAC package
- **Tailwind CSS** - Styling (UI examples)

## Learning Path

**Recommended order for beginners:**

1. **In-Memory Testing** - Understand core concepts without database
2. **Basic MongoDB** - Simple database setup
3. **Prisma PostgreSQL** - Production-ready setup
4. **Complete SaaS** - Real-world application

## Database Setup

### MongoDB
```bash
# Local MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas (free tier)
# https://www.mongodb.com/cloud/atlas
```

### PostgreSQL
```bash
# Local PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=rbac_example \
  --name postgres postgres:latest
```

### MySQL
```bash
# Local MySQL
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=rbac_example \
  --name mysql mysql:latest
```

## Code Patterns

### Server-Side Permission Check
```typescript
// app/api/users/route.ts
import { requirePermission } from '@khannara/next-rbac/server';

export async function POST(req: Request) {
  await requirePermission(adapter, userId, 'users.create');
  // Proceed with logic
}
```

### Client-Side Permission Gate
```tsx
// app/users/page.tsx
import { PermissionGate } from '@khannara/next-rbac/react';

<PermissionGate permission="users.delete" userPermissions={permissions}>
  <DeleteButton />
</PermissionGate>
```

### Middleware Protection
```typescript
// middleware.ts
import { createRBACMiddleware } from '@khannara/next-rbac/server';

const rbacMiddleware = createRBACMiddleware({
  adapter: getRBACAdapter(),
  getUserId: getUserIdFromSession,
});

export async function middleware(req: NextRequest) {
  return rbacMiddleware(req, {
    '/admin': { roles: ['admin'] },
  });
}
```

## Testing Examples

See `in-memory-testing/` for:
- Unit tests with Jest
- Integration tests
- E2E tests with Cypress
- Mocking strategies

## Contributing

Found an issue or want to add an example?
- Open an issue: https://github.com/khannara/next-rbac/issues
- Submit a PR: https://github.com/khannara/next-rbac/pulls

## Support

- 📖 [Documentation](https://github.com/khannara/next-rbac#readme)
- 💬 [Discussions](https://github.com/khannara/next-rbac/discussions)
- 🐛 [Issues](https://github.com/khannara/next-rbac/issues)
