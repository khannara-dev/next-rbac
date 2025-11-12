const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/rbac-example');
  await client.connect();
  const db = client.db('rbac-example');

  // Create roles
  await db.collection('roles').deleteMany({});
  await db.collection('roles').insertMany([
    {
      name: 'admin',
      permissions: [
        'users.create', 'users.read', 'users.update', 'users.delete',
        'products.create', 'products.read', 'products.update', 'products.delete',
        'settings.read', 'settings.update'
      ],
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
    {
      name: 'manager',
      permissions: [
        'users.read',
        'products.create', 'products.read', 'products.update',
      ],
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
    {
      name: 'user',
      permissions: ['users.read', 'products.read'],
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  ]);

  // Create users
  await db.collection('users').deleteMany({});
  await db.collection('users').insertMany([
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: 'manager@example.com',
      password: await bcrypt.hash('manager123', 10),
      name: 'Manager User',
      role: 'manager',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      name: 'Regular User',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  console.log('✅ Database seeded successfully');
  await client.close();
}

seed().catch(console.error);
