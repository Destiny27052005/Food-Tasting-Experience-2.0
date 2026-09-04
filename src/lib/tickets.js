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
        id: "regular",
        name: "Regular",
        priceNaira: 5000,
        description: "Your seat at the tasting table.",
        perks: ["Full tasting menu", "Welcome drink", "Event keepsake"],
    },
    {
        id: "premium",
        name: "Premium",
        priceNaira: 12000,
        description: "A closer look at the craft.",
        perks: [
            "Everything in Regular",
            "Priority seating",
            "Meet-and-greet with Chef Tife",
            "Signature cocktail pairing",
        ],
    },
    {
        id: "vip",
        name: "VIP",
        priceNaira: 25000,
        description: "The full CookWithTife treatment.",
        perks: [
            "Everything in Premium",
            "Front-row chef's table",
            "Exclusive dessert course",
            "Curated gift box",
        ],
    },
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