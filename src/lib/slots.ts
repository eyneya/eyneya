import { supabase } from './supabase';
import type { Slot } from './types';

/**
 * Fetch available slots for a service on a given date.
 * Falls back to client-side slot generation if the edge function is unavailable.
 */
export async function fetchSlots(serviceId: string, dateKey: string): Promise<Slot[]> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-available-slots`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ service_id: serviceId, date: dateKey }),
    });
    if (!res.ok) throw new Error(`slots failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.slots)) return data.slots as Slot[];
    return [];
  } catch {
    // Fallback: generate slots client-side from availability + bookings
    return clientSideSlots(serviceId, dateKey);
  }
}

async function clientSideSlots(serviceId: string, dateKey: string): Promise<Slot[]> {
  const date = new Date(`${dateKey}T00:00:00`);
  const dayOfWeek = date.getDay();

  // Check overrides
  const { data: override } = await supabase
    .from('availability_overrides')
    .select('*')
    .eq('override_date', dateKey)
    .maybeSingle();
  if (override?.is_blocked) return [];

  let startTime = '09:00';
  let endTime = '17:00';
  let active = true;

  if (override && override.custom_start && override.custom_end) {
    startTime = override.custom_start;
    endTime = override.custom_end;
    active = true;
  } else {
    const { data: sched } = await supabase
      .from('availability_schedule')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .maybeSingle();
    if (!sched || !sched.is_active) return [];
    startTime = sched.start_time;
    endTime = sched.end_time;
  }
  if (!active) return [];

  // Service duration/buffer
  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes, buffer_minutes')
    .eq('id', serviceId)
    .maybeSingle();
  if (!service) return [];
  const duration = service.duration_minutes;
  const buffer = service.buffer_minutes;
  const step = duration + buffer;

  // Existing bookings for the date
  const dayStart = new Date(`${dateKey}T00:00:00`);
  const dayEnd = new Date(`${dateKey}T23:59:59`);
  const { data: bookings } = await supabase
    .from('bookings')
    .select('appointment_start, appointment_end')
    .neq('status', 'cancelled')
    .gte('appointment_start', dayStart.toISOString())
    .lte('appointment_end', dayEnd.toISOString());

  const occupied = (bookings ?? []).map((b) => ({
    start: new Date(b.appointment_start).getTime(),
    end: new Date(b.appointment_end).getTime(),
  }));

  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let cursor = new Date(date);
  cursor.setHours(sh, sm, 0, 0);
  const end = new Date(date);
  end.setHours(eh, em, 0, 0);
  const now = Date.now();

  const slots: Slot[] = [];
  while (cursor.getTime() + duration * 60000 <= end.getTime()) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + duration * 60000);
    const sMs = slotStart.getTime();
    const eMs = slotEnd.getTime();

    // Skip past slots if today
    if (sMs < now) {
      cursor = new Date(sMs + step * 60000);
      continue;
    }

    const overlaps = occupied.some((o) => sMs < o.end && eMs > o.start);
    if (!overlaps) {
      slots.push({
        start: slotStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        end: slotEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        iso_start: slotStart.toISOString(),
        iso_end: slotEnd.toISOString(),
      });
    }
    cursor = new Date(sMs + step * 60000);
  }
  return slots;
}
