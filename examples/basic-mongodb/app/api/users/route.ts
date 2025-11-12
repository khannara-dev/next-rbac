import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { requirePermission } from '@khannara/next-rbac/server';
import { getRBACAdapter } from '@/lib/rbac';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adapter = await getRBACAdapter();
  await requirePermission(session.user.id, 'users.read', adapter);

  // Return mock users
  return NextResponse.json([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ]);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adapter = await getRBACAdapter();
  await requirePermission(session.user.id, 'users.create', adapter);

  const body = await req.json();

  // Mock user creation
  return NextResponse.json({
    id: Math.random().toString(),
    ...body,
  }, { status: 201 });
}
