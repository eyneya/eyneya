import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Slot {
  start: string;
  end: string;
  iso_start: string;
  iso_end: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { service_id, date } = await req.json();
    if (!service_id || !date) {
      return new Response(JSON.stringify({ error: "service_id and date are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Check availability_overrides for date
    const { data: override } = await supabase
      .from("availability_overrides")
      .select("*")
      .eq("override_date", date)
      .maybeSingle();

    if (override?.is_blocked) {
      return new Response(JSON.stringify({ slots: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dateObj = new Date(`${date}T00:00:00`);
    const dayOfWeek = dateObj.getDay();

    // 2. Determine start/end time
    let startTime = "09:00";
    let endTime = "17:00";

    if (override && override.custom_start && override.custom_end) {
      startTime = override.custom_start;
      endTime = override.custom_end;
    } else {
      const { data: sched } = await supabase
        .from("availability_schedule")
        .select("*")
        .eq("day_of_week", dayOfWeek)
        .eq("is_active", true)
        .maybeSingle();
      if (!sched) {
        return new Response(JSON.stringify({ slots: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      startTime = sched.start_time;
      endTime = sched.end_time;
    }

    // 3. Fetch service duration/buffer
    const { data: service } = await supabase
      .from("services")
      .select("duration_minutes, buffer_minutes")
      .eq("id", service_id)
      .maybeSingle();
    if (!service) {
      return new Response(JSON.stringify({ error: "service not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const duration = service.duration_minutes;
    const buffer = service.buffer_minutes;
    const step = duration + buffer;

    // 4. Fetch existing bookings for the date (non-cancelled)
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);
    const { data: bookings } = await supabase
      .from("bookings")
      .select("appointment_start, appointment_end")
      .neq("status", "cancelled")
      .gte("appointment_start", dayStart.toISOString())
      .lte("appointment_end", dayEnd.toISOString());

    const occupied = (bookings ?? []).map((b: { appointment_start: string; appointment_end: string }) => ({
      start: new Date(b.appointment_start).getTime(),
      end: new Date(b.appointment_end).getTime(),
    }));

    // 5. Generate slots
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const cursor = new Date(dateObj);
    cursor.setHours(sh, sm, 0, 0);
    const end = new Date(dateObj);
    end.setHours(eh, em, 0, 0);
    const now = Date.now();

    const slots: Slot[] = [];
    while (cursor.getTime() + duration * 60000 <= end.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor.getTime() + duration * 60000);
      const sMs = slotStart.getTime();
      const eMs = slotEnd.getTime();

      // Remove past slots if today
      if (sMs < now) {
        cursor = new Date(sMs + step * 60000);
        continue;
      }

      const overlaps = occupied.some((o: { start: number; end: number }) => sMs < o.end && eMs > o.start);
      if (!overlaps) {
        slots.push({
          start: slotStart.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          end: slotEnd.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          iso_start: slotStart.toISOString(),
          iso_end: slotEnd.toISOString(),
        });
      }
      cursor = new Date(sMs + step * 60000);
    }

    return new Response(JSON.stringify({ slots }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
