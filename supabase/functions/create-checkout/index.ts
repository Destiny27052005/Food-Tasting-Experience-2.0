import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function makeCode(prefix: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  for (const b of bytes) out += chars[b % chars.length];
  return `${prefix}-${out}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:5173";

    if (!paystackSecret) {
      return new Response(
        JSON.stringify({ ok: false, error: "Payment key not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const unitKobo = 30000 * 100; // ₦30,000
    const totalKobo = unitKobo * data.quantity;
    const reference = makeCode("CWT");
    const ticketCode = makeCode("TKT");

    // Insert order record
    const { error: insertError } = await supabaseAdmin.from("orders").insert({
      reference,
      ticket_code: ticketCode,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      ticket_type: "Tasting Ticket",
      quantity: data.quantity,
      unit_amount_kobo: unitKobo,
      amount_kobo: totalKobo,
      food_preference: data.foodPreference,
      dietary_notes: data.dietaryNotes || null,
      status: "pending",
    });

    if (insertError) {
      return new Response(
        JSON.stringify({ ok: false, error: insertError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Paystack
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: totalKobo,
        reference,
        currency: "NGN",
        callback_url: `${siteUrl}/ticket/${reference}`,
        metadata: {
          full_name: data.fullName,
          phone: data.phone,
          ticket_code: ticketCode,
          quantity: data.quantity,
          food_preference: data.foodPreference,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return new Response(
        JSON.stringify({ ok: false, error: paystackData.message || "Payment initiation failed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        reference,
        authorizationUrl: paystackData.data.authorization_url,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});