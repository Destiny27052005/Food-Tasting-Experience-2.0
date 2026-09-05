export const EVENT = Object.freeze({
    name: "CookWithTife Food Tasting Experience",
    edition: "2.0",
    tagline: "An intimate dining experience. Good food, good people and good energy ",
    // Replace with final details when confirmed
    date: "Saturday, 12 December 2026",
    time: "4:00 PM WAT",
    venue: "Mainland, Lagos",
});

export const TICKET_TIERS = [
    {
        name: "Tasting Ticket",
        priceNaira: 30000,
        description: "Your seat at the tasting table.",
        perks: ["Full tasting menu", "Welcome drink", "Event keepsake"],
    }
];

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