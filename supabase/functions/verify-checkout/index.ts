import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch existing order
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("reference", reference)
      .maybeSingle();

    if (!order) {
      return new Response(
        JSON.stringify({ ok: false, error: "Ticket not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify with Paystack if not already paid
    if (order.status !== "paid" && paystackSecret) {
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${paystackSecret}` } }
      );
      const verifyData = await verifyRes.json();

      if (verifyData.data?.status === "success") {
        const { data: updatedOrder } = await supabaseAdmin
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("reference", reference)
          .select()
          .single();

        return new Response(
          JSON.stringify({ ok: true, order: updatedOrder }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ ok: true, order }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});