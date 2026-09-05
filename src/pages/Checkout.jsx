import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startCheckout } from "@/lib/checkout.functions";
import { EVENT, FOOD_PREFERENCES, TICKET } from "@/lib/tickets";

export default function Checkout() {
  const [quantity, setQuantity] = useState(1);
  const [foodPreference, setFoodPreference] = useState(FOOD_PREFERENCES[0]);
  const [loading, setLoading] = useState(false);

  const total = TICKET.priceNaira * quantity;

  useEffect(() => {
    document.title = "Secure Your Seat — CookWithTife Food Tasting Experience 2.0";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Enter your details, tell us your food preference, and pay securely to reserve your CookWithTife tasting seat. Tickets ₦40,000."
      );
    }
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const result = await startCheckout({
        data: {
          fullName: String(form.get("fullName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          company: String(form.get("company") ?? ""),
          quantity,
          foodPreference,
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

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-serif text-lg font-semibold">
          CookWithTife
        </Link>
        <span className="text-sm text-muted-foreground">{EVENT.date}</span>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <h1 className="font-serif text-3xl md:text-4xl">Secure my seat</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us who's coming and how you like to eat. Payment is handled securely.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 rounded-2xl border bg-card p-6">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Number of tickets</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foodPreference">Food preference</Label>
              <select
                id="foodPreference"
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {FOOD_PREFERENCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryNotes">
              Do you eat catfish? Any food allergies? (optional)
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
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Starting payment…" : "Pay now"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}