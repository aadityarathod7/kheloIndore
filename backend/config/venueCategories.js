const VENUE_CATEGORIES = [
  "Turf", "Pickleball", "Swimming Pool", "Snooker", "Pool Club", "Gym",
  "Basketball", "PlayStation", "Yoga", "Golf Club", "Table Tennis", "Kabaddi",
  "Badminton", "Archery", "Zumba Classes", "Shooting", "Hockey (Indoor/Outdoor)",
  "Squash", "Skating (Ice/Roller)", "Tennis", "Football/ Soccer", "Baseball",
  "Volleyball (Indoor/Beach)", "Karate", "Boxing", "Taekwondo", "Sky Martial Arts",
  "Chess Academy", "Dance Academy", "Horse Riding", "Bowling", "Rock Climbing",
  "Go-karting", "Other Sports",
];

const COACH_TRAINER_CATEGORIES = [
  "Cricket", "Pickleball", "Swimming Pool", "Snooker", "Pool Club", "Gym",
  "Basketball", "PlayStation", "Yoga", "Golf Club", "Table Tennis", "Kabaddi",
  "Badminton", "Archery", "Zumba Classes", "Shooting", "Hockey (Indoor/Outdoor)",
  "Squash", "Skating (Ice/Roller)", "Tennis", "Football/ Soccer", "Baseball",
  "Volleyball (Indoor/Beach)", "Karate", "Boxing", "Taekwondo", "Sky Martial Arts",
  "Chess Academy", "Dance Academy", "Horse Riding", "Bowling", "Rock Climbing",
  "Go-karting", "Other Sports",
];

const normalise = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const categoryByKey = new Map(VENUE_CATEGORIES.map((category) => [normalise(category), category]));
const coachTrainerCategoryByKey = new Map(COACH_TRAINER_CATEGORIES.map((category) => [normalise(category), category]));

const legacyAliases = new Map([
  ["cricket turf", "Turf"],
  ["cricket turfs", "Turf"],
  ["cricket ground", "Turf"],
  ["cricket grounds", "Turf"],
  ["football", "Football/ Soccer"],
  ["soccer", "Football/ Soccer"],
  ["football soccer", "Football/ Soccer"],
]);

const coachTrainerLegacyAliases = new Map([
  ["cricket turf", "Cricket"],
  ["cricket turfs", "Cricket"],
  ["cricket ground", "Cricket"],
  ["cricket grounds", "Cricket"],
  ["football", "Football/ Soccer"],
  ["soccer", "Football/ Soccer"],
  ["football soccer", "Football/ Soccer"],
]);

const normaliseVenueCategory = (value) => {
  const key = normalise(value);
  return categoryByKey.get(key) || legacyAliases.get(key) || null;
};

const normaliseCoachTrainerCategory = (value) => {
  const key = normalise(value);
  return coachTrainerCategoryByKey.get(key) || coachTrainerLegacyAliases.get(key) || null;
};

module.exports = {
  VENUE_CATEGORIES,
  COACH_TRAINER_CATEGORIES,
  normaliseVenueCategory,
  normaliseCoachTrainerCategory,
};
