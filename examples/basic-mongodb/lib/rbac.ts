import { MongoDBAdapter } from '@khannara/next-rbac/adapters';
import clientPromise from './mongodb';

let cachedAdapter: MongoDBAdapter | null = null;

export async function getRBACAdapter() {
  if (cachedAdapter) {
    return cachedAdapter;
  }

  const client = await clientPromise;
  const db = client.db('rbac-example');

  cachedAdapter = new MongoDBAdapter({
    db,
    rolesCollection: 'roles',
    usersCollection: 'users',
  });

  return cachedAdapter;
}
