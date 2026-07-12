import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendEmail(to: string, subject: string, html: string, templateName: string, bookingId?: string, clientId?: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return;
  }
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "hello@eyneya.com";
  const replyTo = Deno.env.get("RESEND_REPLY_TO") || "hello@eyneya.com";

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Eyneya Business Solutions <${fromEmail}>`,
        to: [to],
        reply_to: replyTo,
        subject,
        html,
      }),
    });
    const data = await res.json();
    const status = res.ok ? "sent" : "failed";

    await supabase.from("email_logs").insert({
      booking_id: bookingId || null,
      client_id: clientId || null,
      recipient_email: to,
      template_name: templateName,
      subject,
      resend_message_id: data.id || null,
      status,
      error_message: res.ok ? null : JSON.stringify(data),
    });
  } catch (e) {
    console.error("Email send failed:", e.message);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { full_name, email, phone, service_interest, message, source_page } = body;

    if (!full_name || !email || !message) {
      return new Response(JSON.stringify({ error: "full_name, email, and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Insert contact submission
    const { data, error } = await supabase.from("contact_submissions").insert({
      full_name,
      email,
      phone: phone || null,
      service_interest: service_interest || null,
      message,
      source_page: source_page || "contact",
      status: "new",
    }).select("id").single();

    if (error) throw new Error(error.message);

    // Send acknowledgment email to client
    const clientHtml = `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1C1C2E;">
        <h1 style="font-family: Cormorant Garamond, serif; color: #5B2D8E;">We Received Your Message</h1>
        <p>Hi ${full_name},</p>
        <p>Thank you for reaching out to Eyneya Business Solutions. We have received your message and will respond within one business day.</p>
        <div style="background: #F9F7F4; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #6B7280; font-size: 14px;"><strong>Your message:</strong></p>
          <p style="margin: 8px 0 0; color: #1C1C2E;">${message}</p>
        </div>
        <p>If you need immediate help, you can book an appointment directly: <a href="https://www.eyneya.com/book" style="color: #5B2D8E;">Book Now</a></p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">Eyneya Business Solutions<br/>hello@eyneya.com · (770) 555-0142</p>
      </div>
    `;
    await sendEmail(email, "We received your message — Eyneya Business Solutions", clientHtml, "contact-form-acknowledgment");

    // Send admin notification
    const adminEmail = "hello@eyneya.com";
    const adminHtml = `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1C1C2E;">
        <h1 style="font-family: Cormorant Garamond, serif; color: #5B2D8E;">New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Service Interest:</strong> ${service_interest || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>
    `;
    await sendEmail(adminEmail, `New Contact: ${full_name}`, adminHtml, "contact-form-admin-notification");

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
