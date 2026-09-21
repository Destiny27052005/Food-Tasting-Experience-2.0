import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startCheckout } from "@/lib/checkout.functions";
import { supabase } from "@/lib/supabase";
import { EVENT, TICKET } from "@/lib/tickets";

const MAX_SEATS = 30;

export default function Checkout() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [seatsRemaining, setSeatsRemaining] = useState(null);
  const [fetchingSeats, setFetchingSeats] = useState(true);

  const total = TICKET.priceNaira * quantity;
  const isSoldOut = seatsRemaining !== null && seatsRemaining <= 0;

  useEffect(() => {
    document.title = "Secure Your Seat — CookWithTife Food Tasting Experience 2.0";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Enter your details and pay securely to reserve your CookWithTife tasting seat. Tickets ₦40,000."
      );
    }

    // 1. Calculate confirmed sold tickets and remaining seats
    async function fetchSeatCount() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("quantity")
          .eq("status", "paid");

        if (error) {
          console.error("Failed to query seat count:", error.message);
          return;
        }

        if (data) {
          const sold = data.reduce((acc, row) => acc + (row.quantity || 0), 0);
          const remaining = Math.max(0, MAX_SEATS - sold);
          setSeatsRemaining(remaining);

          // Prevent state holding a quantity higher than seats left
          setQuantity((prev) => (remaining > 0 ? Math.min(prev, remaining) : 1));
        }
      } catch (err) {
        console.error("Error fetching seat availability:", err);
      } finally {
        setFetchingSeats(false);
      }
    }

    fetchSeatCount();

    // 2. Real-time subscription to orders updates
    const channel = supabase
      .channel("realtime-seats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchSeatCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);

    try {
      const result = await startCheckout({
        data: {
          fullName: String(form.get("fullName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          company: String(form.get("company") ?? ""),
          quantity,
          foodPreference: "Regular",
          dietaryNotes: String(form.get("dietaryNotes") ?? ""),
        },
      });

      if (!result?.ok) {
        toast.error(result?.error || "Payment initialization failed.");
        return;
      }

      window.location.href = result.authorizationUrl;
    } catch (error) {
      console.error(error);
      toast.error("Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Calculate allowable selection limit based on available capacity
  const maxSelectable = seatsRemaining !== null ? Math.min(10, seatsRemaining) : 10;

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-serif text-lg font-semibold">
          CookWithTife
        </Link>
        <span className="text-sm text-muted-foreground">{EVENT.date}</span>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-serif text-3xl md:text-4xl">Secure my seat</h1>
          {seatsRemaining !== null && (
            <span
              className={`mt-3 sm:mt-0 inline-flex items-center w-fit text-xs font-semibold px-3 py-1 rounded-full border ${isSoldOut
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : seatsRemaining <= 5
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
            >
              {isSoldOut
                ? "Sold Out"
                : `${seatsRemaining} ${seatsRemaining === 1 ? "seat" : "seats"} remaining`}
            </span>
          )}
        </div>

        <p className="mt-2 text-muted-foreground">
          {isSoldOut
            ? "All seats for this edition have been filled."
            : "Tell us who's coming and dietary notes. Payment is handled securely."}
        </p>

        {isSoldOut ? (
          <div className="mt-8 rounded-2xl border bg-card p-8 text-center space-y-4 shadow-sm">
            <h2 className="text-2xl font-serif">Capacity Reached</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              All 30 seats for CookWithTife Food Tasting Experience 2.0 have been booked.
              Follow our social channels for announcements regarding Edition 3.0.
            </p>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/">Back to Homepage</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" required minLength={2} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required minLength={7} maxLength={20} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company / organisation (optional)</Label>
                <Input id="company" name="company" maxLength={120} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Number of tickets</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={maxSelectable}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(maxSelectable, Number(e.target.value) || 1)))
                }
                className="sm:max-w-xs"
                disabled={fetchingSeats || isSoldOut}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryNotes">
                Do you eat catfish? Any food allergies?
              </Label>
              <Textarea
                id="dietaryNotes"
                name="dietaryNotes"
                maxLength={500}
                rows={3}
                placeholder="e.g. No catfish, allergic to peanuts, lactose intolerant..."
              />
            </div>

            <div className="flex items-center justify-between border-t pt-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {quantity} × ₦{TICKET.priceNaira.toLocaleString("en-NG")}
                </p>
                <p className="font-serif text-2xl">₦{total.toLocaleString("en-NG")}</p>
              </div>
              <Button type="submit" size="lg" disabled={loading || fetchingSeats || isSoldOut}>
                {loading ? "Starting payment…" : "Pay now"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}