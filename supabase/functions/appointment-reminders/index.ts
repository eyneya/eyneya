import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const now = new Date();

    // Fetch bookings starting in 23–25 hours (24hr reminder)
    const h23 = new Date(now.getTime() + 23 * 3600000);
    const h25 = new Date(now.getTime() + 25 * 3600000);
    const { data: upcoming24 } = await supabase
      .from("bookings")
      .select("id, booking_reference, service_name, tier_name, appointment_start, appointment_end, client_id, clients(email, full_name)")
      .eq("status", "confirmed")
      .gte("appointment_start", h23.toISOString())
      .lte("appointment_start", h25.toISOString());

    // Fetch bookings starting in 55–65 minutes (1hr reminder)
    const m55 = new Date(now.getTime() + 55 * 60000);
    const m65 = new Date(now.getTime() + 65 * 60000);
    const { data: upcoming1 } = await supabase
      .from("bookings")
      .select("id, booking_reference, service_name, tier_name, appointment_start, appointment_end, client_id, clients(email, full_name)")
      .eq("status", "confirmed")
      .gte("appointment_start", m55.toISOString())
      .lte("appointment_start", m65.toISOString());

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "hello@eyneya.com";
    let sentCount = 0;

    const sendReminder = async (booking: any, hoursLabel: string, template: string) => {
      if (!RESEND_API_KEY || !booking.clients?.email) return;
      const dateStr = new Date(booking.appointment_start).toLocaleString("en-US", {
        weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
      });
      const subject = hoursLabel === "24hr"
        ? `Reminder: Your appointment is tomorrow — ${booking.service_name}`
        : `Your appointment starts in 1 hour — ${booking.service_name}`;

      const html = `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C2E;">
        <h1 style="font-family:Cormorant Garamond,serif;color:#5B2D8E;">Appointment Reminder</h1>
        <p>Hi ${booking.clients.full_name},</p>
        <p>This is a reminder for your upcoming appointment:</p>
        <div style="background:#F9F7F4;border-radius:12px;padding:16px;margin:20px 0;">
          <p style="margin:0;"><strong>${booking.service_name}</strong> — ${booking.tier_name}</p>
          <p style="margin:8px 0 0;color:#6B7280;">${dateStr} EST</p>
          <p style="margin:8px 0 0;color:#6B7280;font-size:14px;">Reference: ${booking.booking_reference}</p>
        </div>
        <p>If you need to reschedule, please email us at hello@eyneya.com with your booking reference.</p>
        <p style="color:#6B7280;font-size:14px;margin-top:24px;">Eyneya Business Solutions</p>
      </div>`;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: `Eyneya Business Solutions <${fromEmail}>`, to: [booking.clients.email], reply_to: fromEmail, subject, html }),
        });
        await supabase.from("email_logs").insert({
          booking_id: booking.id,
          client_id: booking.client_id,
          recipient_email: booking.clients.email,
          template_name: template,
          subject,
          status: "sent",
        });
        sentCount++;
      } catch (e) {
        console.error("Reminder send failed:", e.message);
      }
    };

    for (const b of upcoming24 ?? []) {
      await sendReminder(b, "24hr", "appointment-reminder-24hr");
    }
    for (const b of upcoming1 ?? []) {
      await sendReminder(b, "1hr", "appointment-reminder-1hr");
    }

    return new Response(JSON.stringify({ success: true, sent: sentCount, checked24: upcoming24?.length ?? 0, checked1: upcoming1?.length ?? 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
