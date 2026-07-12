import { supabase } from './supabase';
import type { Service } from './types';

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*, service_tiers(*)')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((s) => ({
    ...s,
    service_tiers: (s.service_tiers ?? []).sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order),
  }));
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*, service_tiers(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    service_tiers: (data.service_tiers ?? []).sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order),
  };
}

export async function fetchServiceTier(serviceSlug: string, tierSlug: string) {
  const service = await fetchServiceBySlug(serviceSlug);
  if (!service) return null;
  const tier = service.service_tiers?.find((t) => slugify(t.name) === tierSlug || t.id === tierSlug);
  return { service, tier: tier ?? null };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
