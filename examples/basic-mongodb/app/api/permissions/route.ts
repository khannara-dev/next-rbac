import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRBACAdapter } from '@/lib/rbac';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adapter = await getRBACAdapter();
    
    // Get user's role
    const role = await adapter.getUserRole(session.user.id);
    
    if (!role) {
      return NextResponse.json({ permissions: [] });
    }
    
    // Get role's permissions
    const permissions = await adapter.getRolePermissions(role);

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
