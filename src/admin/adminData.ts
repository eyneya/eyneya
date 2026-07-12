import { supabase } from '../lib/supabase';

export async function fetchBookings(filters?: {
  status?: string;
  search?: string;
}) {
  let q = supabase.from('bookings').select('*, clients(full_name, email, phone)').order('appointment_start', { ascending: false });
  if (filters?.status && filters.status !== 'all') q = q.eq('status', filters.status);
  if (filters?.search) {
    q = q.or(`booking_reference.ilike.%${filters.search}%,service_name.ilike.%${filters.search}%`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchBookingById(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, clients(*), service_tiers(*), services(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchClients(search?: string) {
  let q = supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (search) {
    q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,business_name.ilike.%${search}%`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchClientById(id: string) {
  const { data: client, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!client) return null;

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', id)
    .order('appointment_start', { ascending: false });
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  return { client, bookings: bookings ?? [], payments: payments ?? [] };
}

export async function fetchPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, bookings(booking_reference, service_name), clients(full_name, email)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchEmailLogs() {
  const { data, error } = await supabase
    .from('email_logs')
    .select('*, bookings(booking_reference)')
    .order('sent_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateBookingNotes(id: string, notes: string) {
  const { error } = await supabase.from('bookings').update({ admin_notes: notes }).eq('id', id);
  if (error) throw error;
}

export async function updateContactStatus(id: string, status: string, notes?: string) {
  const updates: Record<string, unknown> = { status };
  if (notes !== undefined) updates.admin_notes = notes;
  const { error } = await supabase.from('contact_submissions').update(updates).eq('id', id);
  if (error) throw error;
}

export async function fetchAvailabilitySchedule() {
  const { data, error } = await supabase.from('availability_schedule').select('*').order('day_of_week');
  if (error) throw error;
  return data ?? [];
}

export async function updateAvailabilitySchedule(id: string, updates: Record<string, unknown>) {
  const { error } = await supabase.from('availability_schedule').update(updates).eq('id', id);
  if (error) throw error;
}

export async function fetchOverrides() {
  const { data, error } = await supabase.from('availability_overrides').select('*').order('override_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addOverride(override: { override_date: string; is_blocked: boolean; custom_start?: string | null; custom_end?: string | null; reason?: string | null }) {
  const { error } = await supabase.from('availability_overrides').insert(override);
  if (error) throw error;
}

export async function deleteOverride(id: string) {
  const { error } = await supabase.from('availability_overrides').delete().eq('id', id);
  if (error) throw error;
}
