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
  await requirePermission(session.user.id, 'products.read', adapter);

  // Return mock products
  return NextResponse.json([
    { id: '1', name: 'Widget A', price: 29.99 },
    { id: '2', name: 'Widget B', price: 49.99 },
  ]);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adapter = await getRBACAdapter();
  await requirePermission(session.user.id, 'products.create', adapter);

  const body = await req.json();

  // Mock product creation
  return NextResponse.json({
    id: Math.random().toString(),
    ...body,
  }, { status: 201 });
}
