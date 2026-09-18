export const VENUE_CATEGORIES = [
  "Turf", "Pickleball", "Swimming Pool", "Snooker", "Pool Club", "Gym",
  "Basketball", "PlayStation", "Yoga", "Golf Club", "Table Tennis", "Kabaddi",
  "Badminton", "Archery", "Zumba Classes", "Shooting", "Hockey (Indoor/Outdoor)",
  "Squash", "Skating (Ice/Roller)", "Tennis", "Football/ Soccer", "Baseball",
  "Volleyball (Indoor/Beach)", "Karate", "Boxing", "Taekwondo", "Sky Martial Arts",
  "Chess Academy", "Dance Academy", "Horse Riding", "Bowling", "Rock Climbing",
  "Go-karting", "Other Sports",
] as const;

export const COACH_TRAINER_CATEGORIES = [
  "Cricket", "Pickleball", "Swimming Pool", "Snooker", "Pool Club", "Gym",
  "Basketball", "PlayStation", "Yoga", "Golf Club", "Table Tennis", "Kabaddi",
  "Badminton", "Archery", "Zumba Classes", "Shooting", "Hockey (Indoor/Outdoor)",
  "Squash", "Skating (Ice/Roller)", "Tennis", "Football/ Soccer", "Baseball",
  "Volleyball (Indoor/Beach)", "Karate", "Boxing", "Taekwondo", "Sky Martial Arts",
  "Chess Academy", "Dance Academy", "Horse Riding", "Bowling", "Rock Climbing",
  "Go-karting", "Other Sports",
] as const;

export const COACH_TRAINER_CATEGORY_OPTIONS = COACH_TRAINER_CATEGORIES.map((category) => ({
  value: category.toLowerCase(),
  label: category,
}));

export const toCategorySlug = (name: string) => {
  // Retains the established dedicated URL used for cricket turf listings.
  if (name.trim().toLowerCase() === "turf") return "cricket-grounds";

  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
