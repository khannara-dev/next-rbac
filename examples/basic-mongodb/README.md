# Basic MongoDB Example

A simple Next.js application demonstrating RBAC with MongoDB using `@khannara/next-rbac`.

## Features

- ✅ MongoDB adapter setup
- ✅ Server-side permission checks in API routes
- ✅ Client-side permission gates
- ✅ Role-based access control
- ✅ User authentication (demo)
- ✅ Protected routes

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rbac-example

# NextAuth (for demo authentication)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Seed Database

```bash
npm run db:seed
```

This creates:
- 3 roles: `admin`, `manager`, `user`
- 3 demo users:
  - admin@example.com (password: admin123)
  - manager@example.com (password: manager123)
  - user@example.com (password: user123)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
basic-mongodb/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth endpoints
│   │   ├── users/route.ts               # Users API (RBAC protected)
│   │   └── products/route.ts            # Products API (RBAC protected)
│   ├── users/
│   │   └── page.tsx                     # Users page (permission gates)
│   ├── products/
│   │   └── page.tsx                     # Products page
│   └── page.tsx                         # Home page
├── lib/
│   ├── rbac.ts                          # RBAC adapter setup
│   ├── mongodb.ts                       # MongoDB client
│   └── auth.ts                          # NextAuth config
├── types/
│   └── rbac.d.ts                        # Type augmentation
├── scripts/
│   └── seed.ts                          # Database seeding
└── middleware.ts                        # Route protection
```

## RBAC Configuration

### Roles and Permissions

```javascript
// Admin role
{
  name: 'admin',
  permissions: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'products.create', 'products.read', 'products.update', 'products.delete',
    'settings.read', 'settings.update'
  ]
}

// Manager role
{
  name: 'manager',
  permissions: [
    'users.read',
    'products.create', 'products.read', 'products.update',
  ]
}

// User role
{
  name: 'user',
  permissions: [
    'users.read',
    'products.read'
  ]
}
```

### Type-Safe Permissions

```typescript
// types/rbac.d.ts
import '@khannara/next-rbac';

declare module '@khannara/next-rbac' {
  export interface RBACTypes {
    Permission:
      | 'users.create' | 'users.read' | 'users.update' | 'users.delete'
      | 'products.create' | 'products.read' | 'products.update' | 'products.delete'
      | 'settings.read' | 'settings.update';

    Role: 'admin' | 'manager' | 'user';
  }
}
```

## Usage Examples

### API Route Protection

```typescript
// app/api/users/route.ts
import { requirePermission } from '@khannara/next-rbac/server';
import { getRBACAdapter } from '@/lib/rbac';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  const adapter = await getRBACAdapter();

  // Require 'users.create' permission
  await requirePermission(adapter, session.user.id, 'users.create');

  // User has permission, proceed
  const body = await req.json();
  // ... create user logic

  return Response.json({ success: true });
}
```

### Component-Level Protection

```tsx
// app/users/page.tsx
import { PermissionGate } from '@khannara/next-rbac/react';
import { getRolePermissions } from '@khannara/next-rbac/server';

export default async function UsersPage() {
  const session = await auth();
  const adapter = await getRBACAdapter();
  const userRole = await adapter.getUserRole(session.user.id);
  const permissions = await getRolePermissions(adapter, userRole);

  return (
    <div>
      <h1>Users</h1>

      {/* Only show to users with 'users.create' permission */}
      <PermissionGate permission="users.create" userPermissions={permissions}>
        <button>Create User</button>
      </PermissionGate>

      {/* Only show to users with BOTH permissions */}
      <PermissionGate
        permissions={['users.update', 'users.delete']}
        userPermissions={permissions}
        requireAll
      >
        <button>Manage Users</button>
      </PermissionGate>
    </div>
  );
}
```

### Middleware Protection

```typescript
// middleware.ts
import { createRBACMiddleware } from '@khannara/next-rbac/server';
import { getRBACAdapter } from './lib/rbac';

const rbacMiddleware = createRBACMiddleware({
  adapter: await getRBACAdapter(),
  getUserId: async (req) => {
    const session = await getServerSession(req);
    return session?.user?.id || null;
  },
});

export async function middleware(req: NextRequest) {
  return rbacMiddleware(req, {
    '/api/users': { permissions: ['users.read'] },
    '/api/products': { permissions: ['products.read'] },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
```

## Testing Permissions

### Login as Different Users

1. **Admin** (admin@example.com / admin123)
   - Can create, read, update, delete users
   - Can create, read, update, delete products
   - Can view and update settings

2. **Manager** (manager@example.com / manager123)
   - Can read users (cannot create/update/delete)
   - Can create, read, update products (cannot delete)
   - Cannot access settings

3. **User** (user@example.com / user123)
   - Can only read users
   - Can only read products
   - Cannot access settings

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: String,         // 'admin' | 'manager' | 'user'
  created_at: Date,
  updated_at: Date
}
```

### Roles Collection

```javascript
{
  _id: ObjectId,
  name: String,         // 'admin' | 'manager' | 'user'
  permissions: [String],
  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:seed      # Seed database with demo data
npm run db:reset     # Reset database (deletes all data)

# Testing
npm run test         # Run tests
npm run lint         # Run ESLint
```

## Common Issues

### MongoDB Connection Failed

Ensure MongoDB is running:
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Or start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Permission Denied Errors

Check:
1. User is authenticated (session exists)
2. User has correct role in database
3. Role has required permissions
4. Permission string matches exactly (case-sensitive)

## Next Steps

- Add more roles and permissions
- Implement role hierarchy (see Prisma examples)
- Add permission caching
- Customize UI based on permissions

## Support

- 📖 [Main Documentation](https://github.com/khannara/next-rbac#readme)
- 💬 [Ask Questions](https://github.com/khannara/next-rbac/discussions)
- 🐛 [Report Issues](https://github.com/khannara/next-rbac/issues)
