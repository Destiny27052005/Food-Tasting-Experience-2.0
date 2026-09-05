export const EVENT = Object.freeze({
  name: "CookWithTife Food Tasting Experience",
  edition: "2.0",
  tagline: "Come for the experience. Stay for the food.",
  date: "Saturday, December 12, 2026",
  time: "2PM — 5PM",
  theme: "Burst of Colours",
  venue: "Mainland, Lagos",
});

export const TICKET = Object.freeze({
  id: "tasting-ticket",
  name: "Food Tasting 2.0 Ticket",
  priceNaira: 40000,
  description: "One afternoon you’ll actually remember.",
  perks: [
    "A warm, cozy lounge to unwind, interact and meet good people",
    "Games and a puzzle stand — come ready",
    "A proper tasting spread",
    "Drinks available",
    "A hosted evening with the right energy from start to finish",
    "30 people. One unforgettable afternoon.",
  ],
});

// Included as an array for backward-compatibility with any tier selectors
export const TICKET_TIERS = [TICKET];

export const FOOD_PREFERENCES = Object.freeze([
  "Regular",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Halal",
]);

export function formatNaira(kobo) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}