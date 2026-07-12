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
    const body = await req.json();
    const { full_name, email, phone, business_name, business_type, annual_revenue, current_situation, biggest_challenge, plan, referral } = body;

    if (!full_name || !email || !phone) {
      return new Response(JSON.stringify({ error: "full_name, email, and phone are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const message = JSON.stringify({ business_name, business_type, annual_revenue, current_situation, biggest_challenge, referral });

    const { data, error } = await supabase.from("contact_submissions").insert({
      full_name,
      email,
      phone,
      service_interest: `Ongoing Advisory Application — ${plan}`,
      message,
      source_page: "apply",
      status: "new",
    }).select("id").single();

    if (error) throw new Error(error.message);

    // Send emails (best-effort)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "hello@eyneya.com";
      const sendResend = async (to: string, subject: string, html: string, template: string) => {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: `Eyneya Business Solutions <${fromEmail}>`, to: [to], reply_to: fromEmail, subject, html }),
          });
          await supabase.from("email_logs").insert({
            recipient_email: to,
            template_name: template,
            subject,
            status: "sent",
          });
        } catch (e) {
          console.error("Email failed:", e.message);
        }
      };

      const clientHtml = `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C2E;">
        <h1 style="font-family:Cormorant Garamond,serif;color:#5B2D8E;">Your Ongoing Advisory Application Has Been Received</h1>
        <p>Hi ${full_name},</p>
        <p>Thank you for applying for the <strong>${plan}</strong>. We have received your application and will review it within 2 business days.</p>
        <p>Here is what to expect next:</p>
        <ul><li>Our team reviews your application</li><li>We reach out to discuss fit and onboarding</li><li>Your first advisory touchpoint is scheduled</li></ul>
        <p style="color:#6B7280;font-size:14px;margin-top:24px;">Eyneya Business Solutions<br/>hello@eyneya.com</p>
      </div>`;
      await sendResend(email, "Your Ongoing Advisory application has been received", clientHtml, "ongoing-advisory-application");

      const adminHtml = `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C2E;">
        <h1 style="font-family:Cormorant Garamond,serif;color:#5B2D8E;">New Advisory Application</h1>
        <p><strong>Name:</strong> ${full_name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business:</strong> ${business_name || "N/A"}</p><p><strong>Type:</strong> ${business_type}</p>
        <p><strong>Revenue:</strong> ${annual_revenue}</p><p><strong>Situation:</strong> ${current_situation}</p>
        <p><strong>Challenge:</strong> ${biggest_challenge}</p><p><strong>Plan:</strong> ${plan}</p>
      </div>`;
      await sendResend("hello@eyneya.com", `New Advisory Application: ${full_name} — ${plan}`, adminHtml, "advisory-application-admin");
    }

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
