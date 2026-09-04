import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-food.jpg";
import { Button } from "@/components/ui/button";

const EVENT = {
  edition: "04",
  name: "The Artisan Tasting Table",
  tagline: "An intimate five-course journey through modern West African fusion cuisine.",
  date: "Saturday, November 14, 2026",
  time: "5:00 PM – 9:00 PM",
  venue: "The Glasshouse, Victoria Island, Lagos",
};

const TICKET_TIERS = [
  {
    id: "standard",
    name: "Tasting Pass",
    description: "The full multi-course dining experience.",
    priceNaira: 45000,
    perks: [
      "5-course curated tasting menu",
      "Welcome mocktail on arrival",
      "Event program & recipe cards",
    ],
  },
  {
    id: "premium",
    name: "Pairing Experience",
    description: "Elevated dining with sommelier pairings.",
    priceNaira: 75000,
    perks: [
      "5-course curated tasting menu",
      "Curated wine & cocktail pairings",
      "Priority seating near the live kitchen",
      "Signed recipe booklet by Chef Tife",
    ],
  },
  {
    id: "chef-table",
    name: "Chef's Table VIP",
    description: "Exclusive front-row kitchen counter seats.",
    priceNaira: 120000,
    perks: [
      "All Pairing Experience benefits",
      "Interactive pre-dinner canapés with Chef Tife",
      "Take-home bespoke spice kit & gift bag",
      "Reserved prime counter seating",
    ],
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-serif text-lg font-semibold tracking-tight">CookWithTife</span>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#tickets" className="text-muted-foreground hover:text-foreground">
            Tickets
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Edition {EVENT.edition}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{EVENT.name}</h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">{EVENT.tagline}</p>
          <dl className="mt-8 grid gap-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-20 text-muted-foreground">Date</dt>
              <dd className="font-medium">{EVENT.date}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 text-muted-foreground">Time</dt>
              <dd className="font-medium">{EVENT.time}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 text-muted-foreground">Venue</dt>
              <dd className="font-medium">{EVENT.venue}</dd>
            </div>
          </dl>
          <Button asChild size="lg" className="mt-8">
            <Link to="/checkout">Get tickets</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <img
            src={heroImage}
            alt="Plated tasting course from the CookWithTife Food Tasting Experience"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </section>

      <section id="tickets" className="border-t bg-card/60 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-3xl">Choose your seat</h2>
          <p className="mt-2 text-muted-foreground">
            Every ticket includes the full tasting menu. Pick the experience level you want.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TICKET_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-2xl border bg-background p-6 shadow-sm"
              >
                <h3 className="font-serif text-2xl">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                <p className="mt-4 text-3xl font-semibold text-primary">
                  ₦{tier.priceNaira.toLocaleString("en-NG")}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="secondary" className="mt-6">
                  <Link to={`/checkout?tier=${tier.id}`}>
                    Select {tier.name}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CookWithTife. All rights reserved.
      </footer>
    </div>
  );
}