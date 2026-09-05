import { useEffect } from "react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-food.jpg";
import { Button } from "@/components/ui/button";
import { EVENT, TICKET } from "@/lib/tickets";

export default function Index() {
  useEffect(() => {
    document.title = "CookWithTife Food Tasting Experience 2.0 — Get Tickets";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Book your seat at CookWithTife Food Tasting Experience 2.0 in Lagos. Good food, good people, good energy."
      );
    }
  }, []);

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
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
            {EVENT.tagline}
          </h1>
          <div className="mt-6 max-w-md space-y-4 text-lg text-muted-foreground">
            <p>
              You’ve worked hard this year. You’ve life-d hard this year. Food Tasting 2.0 is your
              chance to stop, be somewhere beautiful, eat really good food and just enjoy yourself.
              Genuinely.
            </p>
            <p>This is an experience first. The food just happens to be very good.</p>
          </div>
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
            <div className="flex gap-3">
              <dt className="w-20 text-muted-foreground">Price</dt>
              <dd className="font-medium text-primary">
                ₦{TICKET.priceNaira.toLocaleString("en-NG")}
              </dd>
            </div>
          </dl>
          <Button asChild size="lg" className="mt-8">
            <Link to="/checkout">Secure my seat →</Link>
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

      <section className="border-t bg-card/60 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl">What to expect</h2>
            <p className="mt-2 text-muted-foreground">
              Warm, intimate, elevated — editorial food photography meets a private dinner
              invitation.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "A warm, cozy lounge built for you to unwind, interact and meet good people.",
              "Games and a puzzle stand — come ready.",
              "Good food. A proper tasting spread.",
              "Drinks available.",
              "A hosted evening with the right energy from start to finish.",
              "30 people. One afternoon you’ll actually remember.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border bg-background p-4">
                <span className="mt-1 text-primary">•</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="tickets" className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl">One ticket. The whole table.</h2>
          <p className="mt-2 text-muted-foreground">
            Every seat includes the full experience — just tell us how you like to eat.
          </p>
          <div className="mx-auto mt-10 max-w-md rounded-2xl border bg-card p-8 shadow-sm">
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
              <Link to="/checkout">Secure my seat →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-card/60 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-3xl">Before you book</h2>
          <div className="mt-6 space-y-2 text-muted-foreground">
            <p>Do you eat catfish?</p>
            <p>Any food allergies?</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Let us know in the checkout form so we can make sure your plate is perfect.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/checkout">Secure my seat →</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CookWithTife. All rights reserved.</p>
        <a
          href="https://instagram.com/cookwithtife"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block hover:text-foreground"
        >
          @cookwithtife
        </a>
      </footer>
    </div>
  );
}