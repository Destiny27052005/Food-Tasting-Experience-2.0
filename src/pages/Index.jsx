import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-food.jpg";
import { Button } from "@/components/ui/button";
import { EVENT, TICKET } from "@/lib/tickets";

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
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl">One ticket. The whole table.</h2>
          <p className="mt-2 text-muted-foreground">
            Every seat includes the full tasting menu — just tell us how you like to eat.
          </p>
          <div className="mx-auto mt-10 max-w-md rounded-2xl border bg-background p-8 shadow-sm">
            <h3 className="font-serif text-2xl">{TICKET.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{TICKET.description}</p>
            <p className="mt-4 text-4xl font-semibold text-primary">
              ₦{TICKET.priceNaira.toLocaleString("en-NG")}
            </p>
            <ul className="mt-6 space-y-2 text-left text-sm">
              {TICKET.perks.map((perk) => (
                <li key={perk} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full">
              <Link to="/checkout">Get your ticket</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CookWithTife. All rights reserved.
      </footer>
    </div>
  );
}