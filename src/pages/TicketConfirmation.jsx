import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { verifyPayment } from "@/lib/checkout.functions";
import { EVENT, formatNaira } from "@/lib/tickets";

export default function TicketConfirmation() {
    const { reference } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qr, setQr] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadTicket() {
            if (!reference) {
                setLoading(false);
                return;
            }

            try {
                const res = await verifyPayment({ reference });
                if (isMounted && res?.ok && res.order) {
                    setOrder(res.order);
                }
            } catch (err) {
                console.error("Verification failed:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadTicket();

        return () => {
            isMounted = false;
        };
    }, [reference]);

    useEffect(() => {
        if (!order?.ticket_code) return;

        let active = true;
        import("qrcode")
            .then(async (QRCode) => {
                const url = await QRCode.toDataURL(
                    `${EVENT.name} ${EVENT.edition} | ${order.reference} | ${order.ticket_code}`,
                    { width: 320, margin: 1 }
                );
                if (active) setQr(url);
            })
            .catch((err) => {
                console.error("Failed to render QR code:", err);
            });

        return () => {
            active = false;
        };
    }, [order?.ticket_code, order?.reference]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-10 text-muted-foreground">
                Confirming your payment…
            </div>
        );
    }

    if (!order) {
        return (
            <div className="mx-auto max-w-md p-10 text-center">
                <h1 className="font-serif text-2xl">Ticket not found</h1>
                <p className="mt-2 text-sm text-muted-foreground">Check the link and try again.</p>
                <Button asChild className="mt-6">
                    <Link to="/">Back home</Link>
                </Button>
            </div>
        );
    }

    const paid = order.status === "paid";

    return (
        <div className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-lg">
                <Link to="/" className="font-serif text-lg font-semibold">
                    CookWithTife
                </Link>

                <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="bg-primary px-6 py-5 text-primary-foreground">
                        <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                            Edition {EVENT.edition}
                        </p>
                        <h1 className="mt-1 font-serif text-2xl">{EVENT.name}</h1>
                        <p className="mt-1 text-sm opacity-90">
                            {EVENT.date} · {EVENT.time}
                        </p>
                        <p className="text-sm opacity-90">{EVENT.venue}</p>
                    </div>

                    <div className="space-y-4 p-6">
                        <div
                            className={`rounded-md px-3 py-2 text-sm ${paid
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {paid ? "Payment confirmed — you're in." : "Payment pending confirmation."}
                        </div>

                        {qr && paid && (
                            <img
                                src={qr}
                                alt={`QR code for ticket ${order.ticket_code}`}
                                className="mx-auto h-48 w-48 rounded-lg border bg-background p-2"
                            />
                        )}

                        <dl className="grid gap-2 text-sm">
                            <Row label="Attendee" value={order.full_name} />
                            <Row label="Email" value={order.email} />
                            <Row label="Ticket" value={`${order.ticket_type} × ${order.quantity}`} />
                            <Row label="Amount" value={formatNaira(order.amount_kobo ?? 0)} />
                            <Row label="Food preference" value={order.food_preference ?? "—"} />
                            {order.dietary_notes && (
                                <Row label="Dietary notes" value={order.dietary_notes} />
                            )}
                            <Row label="Reference" value={order.reference} />
                            <Row label="Ticket code" value={order.ticket_code ?? "—"} />
                        </dl>

                        <Button className="w-full" onClick={() => window.print()}>
                            Download / print ticket
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b pb-2 last:border-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
        </div>
    );
}