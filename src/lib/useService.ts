import { useEffect, useState } from 'react';
import { fetchServiceBySlug } from '../lib/services';
import type { Service } from '../lib/types';

export function useService(slug: string | undefined) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchServiceBySlug(slug ?? '')
      .then((s) => {
        if (!active) return;
        setService(s);
        setLoading(false);
      })
      .catch((e) => {
        if (!active) return;
        setError(e.message);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { service, loading, error };
}
