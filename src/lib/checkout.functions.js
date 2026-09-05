import { supabase } from "./supabase";

export async function startCheckout({ data }) {
    const { data: result, error } = await supabase.functions.invoke("create-checkout", {
        body: data,
    });

    if (error) {
        return { ok: false, error: error.message };
    }

    return result;
}

export async function verifyPayment({ reference }) {
    const { data: result, error } = await supabase.functions.invoke("verify-checkout", {
        body: { reference },
    });

    if (error) {
        return { ok: false, error: error.message };
    }

    return result;
}