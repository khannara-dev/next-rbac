import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function usePermissions() {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      if (!session?.user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/permissions');
        if (response.ok) {
          const data = await response.json();
          setPermissions(data.permissions || []);
        } else {
          setPermissions([]);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [session]);

  return { permissions, loading };
}
