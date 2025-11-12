'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Next-RBAC Basic MongoDB Example</h1>

        {session ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
              <p className="font-semibold">Signed in as: {session.user?.email}</p>
              <p className="text-sm text-gray-600">Role: {session.user?.role || 'N/A'}</p>
              <button
                onClick={() => signOut()}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign out
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/users"
                  className="block p-6 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition"
                >
                  <h3 className="text-xl font-semibold mb-2">Users</h3>
                  <p className="text-gray-600">View and manage users (requires users.read permission)</p>
                </Link>
                <Link
                  href="/products"
                  className="block p-6 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition"
                >
                  <h3 className="text-xl font-semibold mb-2">Products</h3>
                  <p className="text-gray-600">View and manage products (requires products.read permission)</p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="mb-4">You are not signed in.</p>
            <button
              onClick={() => signIn()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign in
            </button>
          </div>
        )}

        <div className="mt-12 p-6 bg-gray-50 rounded">
          <h2 className="text-xl font-semibold mb-4">Test Accounts</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Admin:</strong> admin@example.com / admin123</p>
            <p><strong>Manager:</strong> manager@example.com / manager123</p>
            <p><strong>User:</strong> user@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
