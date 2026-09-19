/**
 * Fresh local showcase data for UI and booking tests.
 *
 * Creates complete public profiles, images, memberships and two months of
 * slots. With --reset it produces six venues, coaches and trainers for every
 * configured category.
 *
 * Run: npm run seed:showcase
 * Login for seeded provider accounts: Demo@1234
 */
// Resolve the backend environment file from this script, not from the shell's
// current directory, so `node seeds/seed_fresh_showcase_data.js` works anywhere.
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Venue = require("../models/Venue1");
const Coach = require("../models/CoachModel");
const Trainer = require("../models/PersonalTrainingModel");
const Slot = require("../models/SlotModel");
const CoachSlot = require("../models/CoachSlotsModel");
const TrainerSlot = require("../models/PersonalTrainerSlotModel");

const image = (src) => ({ src });
const clone = (value) => JSON.parse(JSON.stringify(value));
const membershipPlans = (basePrice) => [
  { name: "Monthly", months: 1, price: basePrice, priority: "Standard Booking", discount: "Flexible plan", support: "Basic support", includes_coaching: true },
  { name: "Quarterly", months: 3, price: basePrice * 3 - 300, priority: "Priority Booking", discount: "Save ₹300", support: "Member support", includes_coaching: true },
  { name: "Half-Yearly", months: 6, price: basePrice * 6 - 900, priority: "Priority Booking", discount: "Save ₹900", support: "Member support", includes_coaching: true },
  { name: "Yearly", months: 12, price: basePrice * 12 - 2400, priority: "High Priority Booking", discount: "Save ₹2,400", support: "Premium support", includes_coaching: true },
];

const assets = {
  venueA: "/assets/img/venues/venues-03.jpg",
  venueB: "/assets/img/venues/venues-08.jpg",
  venueC: "/assets/img/venues/venues-12.jpg",
  coachA: "/assets/img/profiles/avatar-01.jpg",
  coachB: "/assets/img/profiles/avatar-04.jpg",
  trainerA: "/assets/img/profiles/avatar-06.jpg",
  trainerB: "/assets/img/profiles/avatar-08.jpg",
  galleryA: "/assets/img/gallery/gallery-01.jpg",
  galleryB: "/assets/img/gallery/gallery-02.jpg",
};

const availability = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  .map((day) => ({ day, startTime: "00:00", endTime: "23:59" }));

const formatTime = (minutes) => `${String(Math.floor((minutes % 1440) / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const halfHourVenueSlots = (hourlyPrice) => Array.from({ length: 48 }, (_, index) => ({
  startTime: formatTime(index * 30),
  // Midnight is represented as 00:00 because the slot APIs only accept HH:mm.
  endTime: formatTime((index + 1) * 30),
  price: hourlyPrice / 2,
  isBooked: false,
  isOfflineBlocked: false,
}));
const halfHourProviderSlots = (hourlyPrice) => Array.from({ length: 48 }, (_, index) => ({
  start_time: formatTime(index * 30),
  end_time: formatTime((index + 1) * 30),
  price: hourlyPrice / 2,
  isBooked: false,
  isOfflineBlocked: false,
}));

const VENUE_CATEGORIES = [
  "Turf", "Pickleball", "Swimming Pool", "Snooker", "Pool Club", "Gym", "Basketball", "PlayStation", "Yoga", "Golf Club", "Table Tennis", "Kabaddi", "Badminton", "Archery", "Zumba Classes", "Shooting", "Hockey Indoor Outdoor", "Squash", "Skating Ice Roller", "Tennis", "Football Soccer", "Baseball", "Volleyball Indoor Beach", "Karate", "Boxing", "Taekwondo", "Sky Martial Arts", "Chess Academy", "Dance Academy", "Horse Riding", "Bowling", "Rock Climbing", "Go Karting", "Other Sports",
];

const COACH_TRAINER_CATEGORIES = [
  "Cricket", "Pickleball", "Swimming Pool", "Snooker", "Pool Club", "Gym", "Basketball", "PlayStation", "Yoga", "Golf Club", "Table Tennis", "Kabaddi", "Badminton", "Archery", "Zumba Classes", "Shooting", "Hockey Indoor Outdoor", "Squash", "Skating Ice Roller", "Tennis", "Football Soccer", "Baseball", "Volleyball Indoor Beach", "Karate", "Boxing", "Taekwondo", "Sky Martial Arts", "Chess Academy", "Dance Academy", "Horse Riding", "Bowling", "Rock Climbing", "Go Karting", "Other Sports",
];

const toSlug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const providerName = (category, number, suffix) => `${category} ${suffix} ${number}`;

async function ensureUser({ first_name, last_name, email, mobile, role, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { email },
    { $set: { first_name, last_name, email, mobile, role, password: hashedPassword, is_admin_access: 1, status: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

async function saveProvider(Model, email, data) {
  let provider = await Model.findOne({ email });
  if (!provider) provider = new Model({ email, ...data });
  else Object.assign(provider, data);
  await provider.save();
  return provider;
}

async function seedVenue(data) {
  let venue = await Venue.findOne({ emailId: data.emailId });
  if (!venue) venue = new Venue(data);
  else Object.assign(venue, data);
  await venue.save();
  return venue;
}

function daysAhead() {
  return Array.from({ length: 62 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  });
}

async function resetProviderData() {
  await Promise.all([
    Slot.deleteMany({}),
    CoachSlot.deleteMany({}),
    TrainerSlot.deleteMany({}),
    Venue.deleteMany({}),
    Coach.deleteMany({}),
    Trainer.deleteMany({}),
    User.deleteMany({ role: { $in: ["Venue Admin", "Coach", "Personal Trainer"] } }),
  ]);
  console.log("Removed existing venue, coach, trainer, provider-account, and provider-slot test data.");
}

async function seedVenueSlots(venue) {
  await Slot.bulkWrite(daysAhead().map((date) => ({
    updateOne: {
      filter: { venue_id: venue._id, date },
      update: { $set: { venue_id: venue._id, date, slots: halfHourVenueSlots(venue.price_per_hr) } }, upsert: true,
    },
  })));
}

async function seedCoachSlots(coach) {
  await CoachSlot.bulkWrite(daysAhead().map((date) => ({
    updateOne: {
      filter: { coachId: coach._id, start_date: date },
      update: { $set: { coachId: coach._id, start_date: date, end_date: date, status: true, slots: halfHourProviderSlots(coach.price) } }, upsert: true,
    },
  })));
}

async function seedTrainerSlots(trainer) {
  await TrainerSlot.bulkWrite(daysAhead().map((date) => ({
    updateOne: {
      filter: { trainerId: trainer._id, start_date: date },
      update: { $set: { trainerId: trainer._id, start_date: date, end_date: date, status: true, slots: halfHourProviderSlots(trainer.price) } }, upsert: true,
    },
  })));
}

async function main() {
  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!uri) throw new Error("DATABASE_URL or MONGODB_URI is missing.");
  await mongoose.connect(uri);
  if (process.argv.includes("--reset")) await resetProviderData();
  const password = "Demo@1234";

  const venueData = [
    {
      name: "Indore Aqua & Fitness Club", emailId: "showcase.aqua@kheloindore.test", vendor_type: "Swimming Pool", category: "Swimming", categories: ["Swimming", "Gym"],
      address: "41 Sapphire Square, Vijay Nagar", city: "Indore", state: "Madhya Pradesh", zipcode: "452010", near_by_location: "Vijay Nagar", contact_number: "9400000101", other_contact_number: "9400000102",
      google_location: "https://maps.google.com/?q=22.7533,75.8937", googleCoordinates: { latitude: 22.7533, longitude: 75.8937 }, price_per_hr: 650, capacity: 60, status: true, verification_status: 1, awaiting_approval: false,
      is_featured_paid: true, venue_setting: "covered", venue_level: "ground-floor", venue_condition: "new", opening_date: new Date("2024-01-15"), has_sound_system: true, air_conditioning: "ac", has_cafeteria: true, venue_size: "25m pool and 3,500 sq ft fitness floor",
      description: "A modern swimming and fitness club with certified lifeguards, temperature-controlled water, strength equipment and family changing rooms.", amenities: ["Parking", "Changing Rooms", "Locker", "Shower", "Drinking Water", "First Aid", "Wi-Fi"], facilities: ["25m Swimming Pool", "Kids Pool", "Gym", "Steam Room", "Cafeteria"], gameType: "Swimming, Fitness", package_type: ["Hourly", "Membership"],
      membership_plans: membershipPlans(1800), sports_details: [{ sport: "Swimming", price_per_hr: 650, capacity: 20, size: "25 metres", description: "Temperature-controlled lap pool with lifeguard." }, { sport: "Gym", price_per_hr: 250, capacity: 30, size: "3,500 sq ft", description: "Strength and cardio equipment." }],
      policiesAndRules: "Swimming cap is mandatory. Children under 12 require adult supervision. Arrive 10 minutes before your slot.", additionalNotes: "Certified coaches and women-only batches are available.",
      images: [image(assets.venueA), image(assets.venueB), image(assets.galleryA)], videos: [], open_at: new Date("2026-01-01T05:30:00"), close_at: new Date("2026-01-01T22:00:00"),
    },
    {
      name: "SmashPad Pickleball Arena", emailId: "showcase.smashpad@kheloindore.test", vendor_type: "Pickleball", category: "Pickleball", categories: ["Pickleball", "Badminton"],
      address: "9 Orbit Mall Road, Scheme 140", city: "Indore", state: "Madhya Pradesh", zipcode: "452016", near_by_location: "Nipania", contact_number: "9400000201", other_contact_number: "9400000202",
      google_location: "https://maps.google.com/?q=22.7215,75.8852", googleCoordinates: { latitude: 22.7215, longitude: 75.8852 }, price_per_hr: 500, capacity: 32, status: true, verification_status: 1, awaiting_approval: false,
      is_featured_paid: true, venue_setting: "covered", venue_level: "ground-floor", venue_condition: "new", opening_date: new Date("2025-03-01"), has_sound_system: true, air_conditioning: "non-ac", has_cafeteria: true, venue_size: "Four indoor courts",
      description: "Premium indoor pickleball arena with tournament-grade courts, coaching programs and a friendly community lounge.", amenities: ["Parking", "Equipment Rental", "Seating", "Washrooms", "First Aid", "CCTV"], facilities: ["4 Indoor Courts", "Pro Shop", "Community Lounge", "Equipment Rental"], gameType: "Pickleball, Badminton", package_type: ["Hourly", "Membership"],
      membership_plans: membershipPlans(1500), sports_details: [{ sport: "Pickleball", price_per_hr: 500, capacity: 8, size: "44 x 20 ft", description: "Tournament-grade indoor court." }, { sport: "Badminton", price_per_hr: 400, capacity: 4, size: "Standard", description: "Synthetic indoor court." }],
      policiesAndRules: "Non-marking shoes are required. Court changes may be made for tournament operations. Please respect booked slot timings.", additionalNotes: "Paddles and balls can be rented at reception.",
      images: [image(assets.venueB), image(assets.venueC), image(assets.galleryB)], videos: [], open_at: new Date("2026-01-01T06:00:00"), close_at: new Date("2026-01-01T23:30:00"),
    },
  ];

  venueData.push(
    { ...clone(venueData[0]), name: "Central Cricket Turf", emailId: "showcase.cricket@kheloindore.test", vendor_type: "Cricket Turf", category: "Cricket", categories: ["Cricket", "Football"], address: "18 Race Course Road, Palasia", near_by_location: "Palasia", contact_number: "9400000203", other_contact_number: "9400000204", price_per_hr: 850, capacity: 22, venue_size: "Professional box cricket turf", description: "Floodlit synthetic turf for cricket and five-a-side football with a dedicated match-day lounge.", amenities: ["Floodlights", "Parking", "Washrooms", "Seating", "Drinking Water", "First Aid"], facilities: ["Synthetic Turf", "Practice Nets", "Scoreboard", "Changing Rooms"], gameType: "Cricket, Football", membership_plans: membershipPlans(1900), sports_details: [{ sport: "Cricket", price_per_hr: 850, capacity: 22, size: "70 x 50 ft", description: "Floodlit synthetic box cricket turf." }, { sport: "Football", price_per_hr: 850, capacity: 10, size: "70 x 50 ft", description: "Five-a-side football turf." }], images: [image(assets.venueC), image(assets.venueA), image(assets.galleryA)] },
    { ...clone(venueData[1]), name: "GoalLine Football Arena", emailId: "showcase.football@kheloindore.test", vendor_type: "Football Turf", category: "Football", categories: ["Football", "Cricket"], address: "32 Super Corridor, Rau", near_by_location: "Rau", contact_number: "9400000205", other_contact_number: "9400000206", price_per_hr: 750, capacity: 20, venue_size: "Outdoor seven-a-side football arena", description: "A spacious seven-a-side football arena with tournament lighting, spectator seating and coaching batches.", amenities: ["Floodlights", "Parking", "Seating", "CCTV", "First Aid"], facilities: ["Seven-a-side Turf", "Spectator Stand", "Changing Rooms", "Coaching Area"], gameType: "Football, Cricket", membership_plans: membershipPlans(1750), sports_details: [{ sport: "Football", price_per_hr: 750, capacity: 14, size: "Seven-a-side", description: "Outdoor football turf with floodlights." }, { sport: "Cricket", price_per_hr: 750, capacity: 20, size: "70 x 50 ft", description: "Box cricket configuration." }], images: [image(assets.venueB), image(assets.venueC), image(assets.galleryB)] },
    { ...clone(venueData[0]), name: "Baseline Tennis Centre", emailId: "showcase.tennis@kheloindore.test", vendor_type: "Tennis", category: "Tennis", categories: ["Tennis", "Badminton"], address: "6 Residency Area, MG Road", near_by_location: "Residency Area", contact_number: "9400000207", other_contact_number: "9400000208", price_per_hr: 700, capacity: 16, venue_size: "Three all-weather tennis courts", description: "All-weather tennis courts with junior academies, ball machines and evening coaching sessions.", amenities: ["Parking", "Drinking Water", "Equipment Rental", "Washrooms", "Seating"], facilities: ["3 Tennis Courts", "Ball Machine", "Coaching Wall", "Pro Shop"], gameType: "Tennis, Badminton", membership_plans: membershipPlans(1850), sports_details: [{ sport: "Tennis", price_per_hr: 700, capacity: 4, size: "Standard court", description: "All-weather acrylic tennis court." }, { sport: "Badminton", price_per_hr: 450, capacity: 4, size: "Standard court", description: "Indoor synthetic badminton court." }], images: [image(assets.venueA), image(assets.venueC), image(assets.galleryA)] },
    { ...clone(venueData[1]), name: "Prana Yoga & Wellness Studio", emailId: "showcase.yoga@kheloindore.test", vendor_type: "Yoga", category: "Yoga", categories: ["Yoga", "Zumba", "Fitness"], address: "57 Saket Nagar, Old Palasia", near_by_location: "Old Palasia", contact_number: "9400000209", other_contact_number: "9400000210", price_per_hr: 350, capacity: 25, venue_size: "2,000 sq ft wellness studio", description: "A calm, light-filled studio for yoga, pilates, meditation and dance-fitness sessions.", amenities: ["Parking", "Changing Rooms", "Drinking Water", "Air Conditioning", "Locker"], facilities: ["Yoga Studio", "Meditation Room", "Sound System", "Props Rental"], gameType: "Yoga, Zumba, Fitness", membership_plans: membershipPlans(1300), sports_details: [{ sport: "Yoga", price_per_hr: 350, capacity: 20, size: "1,200 sq ft", description: "Ventilated yoga and meditation studio." }, { sport: "Zumba", price_per_hr: 400, capacity: 25, size: "1,200 sq ft", description: "Sound-equipped group fitness studio." }], images: [image(assets.galleryA), image(assets.galleryB), image(assets.venueB)] }
  );

  const allVenueData = VENUE_CATEGORIES.flatMap((category, categoryIndex) =>
    Array.from({ length: 6 }, (_, copyIndex) => {
      const serial = categoryIndex * 6 + copyIndex + 1;
      const template = clone(venueData[serial % venueData.length]);
      const slug = toSlug(category);
      return {
        ...template,
        name: providerName(category, copyIndex + 1, "Arena"),
        emailId: `showcase.venue.${slug}.${copyIndex + 1}@kheloindore.test`,
        vendor_type: category,
        category,
        categories: [category],
        gameType: category,
        contact_number: String(9001000000 + serial),
        other_contact_number: String(9001100000 + serial),
        address: `${20 + serial} Sports Avenue, Indore`,
        near_by_location: ["Vijay Nagar", "Palasia", "Nipania", "Rau", "Scheme 54", "Bhawarkua"][serial % 6],
        price_per_hr: 350 + (serial % 8) * 100,
        sports_details: [{ sport: category, price_per_hr: 350 + (serial % 8) * 100, capacity: 12 + (serial % 20), size: "Standard", description: `Fully equipped ${category} facility.` }],
      };
    })
  );

  const venues = [];
  for (const data of allVenueData) {
    const account = await ensureUser({ first_name: data.name, last_name: "Admin", email: `admin.${data.emailId}`, mobile: Number(data.contact_number), role: "Venue Admin", password });
    const venue = await seedVenue({ ...data, vendor_id: account._id });
    venues.push(venue);
    await seedVenueSlots(venue);
  }

  const coachData = [
    { first_name: "Neel", last_name: "Deshmukh", email: "showcase.neel.coach@kheloindore.test", mobile: 9400000301, trainer_type: "Tennis Coach", category: "Tennis", category_type: "Tennis", gender: "Male", age: 32, date_of_birth: "1994-02-18", price: 1400, experience: 9, venue_name: venues[1].name, near_by_location: "Nipania", address: "14 Palm Grove, Nipania", city: "Indore", state: "Madhya Pradesh", zipcode: "452016", location: { address: "14 Palm Grove, Nipania", city: "Indore", state: "Madhya Pradesh", zipcode: "452016", google_location: "https://maps.google.com/?q=22.7215,75.8852" }, specializations: "Tennis fundamentals, Match strategy, Serve mechanics, Junior development", skills: "Biomechanics, Video analysis, Mental conditioning", qualifications: "AITA Level 2 Coach\nB.P.Ed, DAVV\nITF Play Tennis certified", bio: "A performance tennis coach who develops confident beginners and competitive junior players through structured, enjoyable sessions.", languages: ["Hindi", "English", "Marathi"], coaching_levels: ["Beginner", "Intermediate", "Advanced"], own_level: "Advanced", response_time: "Within 2 hours", class_location: "SmashPad Pickleball Arena", training_mode: "Offline", students_trained: 240, social_media: { instagram: "https://instagram.com/kheloindore", facebook: "", youtube: "", twitter: "", linkedin: "" }, daily_availability: availability, gallery: [image(assets.coachA), image(assets.galleryA), image(assets.galleryB)], profile_picture: [image(assets.coachA)], identity_Proof: [image(assets.coachA)], other_document: [image(assets.galleryA)], gallery_videos: [], package: { monthly: 5200, quarterly: 14800, yearly: 55000 }, membership_plans: membershipPlans(1600), availability: "Monday to Saturday, 6:00 AM - 8:00 PM", policiesAndRules: "Please arrive five minutes early. Cancellations are accepted up to 12 hours before the session.", role: "Coach", status: true, verification_status: 1, is_admin_access: 1, awaiting_approval: false, isUpdated: true, rating: 4.8, reviews_count: 38 },
    { first_name: "Sana", last_name: "Qureshi", email: "showcase.sana.coach@kheloindore.test", mobile: 9400000302, trainer_type: "Badminton Coach", category: "Badminton", category_type: "Badminton", gender: "Female", age: 29, date_of_birth: "1997-07-09", price: 1200, experience: 7, venue_name: "Indore Sports Academy", near_by_location: "Vijay Nagar", address: "27 Sports Enclave, Vijay Nagar", city: "Indore", state: "Madhya Pradesh", zipcode: "452010", location: { address: "27 Sports Enclave, Vijay Nagar", city: "Indore", state: "Madhya Pradesh", zipcode: "452010", google_location: "https://maps.google.com/?q=22.7533,75.8937" }, specializations: "Footwork, Singles strategy, Doubles rotations, School competition preparation", skills: "Agility drills, Match planning, Injury prevention", qualifications: "BWF Level 1 Coach\nM.P. State Badminton Association certified", bio: "Sana creates high-energy badminton programmes that build movement, game awareness and confidence for young athletes and adults.", languages: ["Hindi", "English", "Urdu"], coaching_levels: ["Beginner", "Intermediate"], own_level: "Advanced", response_time: "Within 1 hour", class_location: "Indore Sports Academy", training_mode: "Both", students_trained: 180, social_media: { instagram: "https://instagram.com/kheloindore", facebook: "", youtube: "", twitter: "", linkedin: "" }, daily_availability: availability, gallery: [image(assets.coachB), image(assets.galleryB)], profile_picture: [image(assets.coachB)], identity_Proof: [image(assets.coachB)], other_document: [image(assets.galleryB)], gallery_videos: [], package: { monthly: 4600, quarterly: 13100, yearly: 49000 }, membership_plans: membershipPlans(1400), availability: "Tuesday to Sunday, 7:00 AM - 7:00 PM", policiesAndRules: "Indoor court shoes are required. Bring your racket and water bottle. Reschedule with six hours notice.", role: "Coach", status: true, verification_status: 1, is_admin_access: 1, awaiting_approval: false, isUpdated: true, rating: 4.7, reviews_count: 26 },
  ];

  coachData.push(
    { ...clone(coachData[0]), first_name: "Arjun", last_name: "Rathore", email: "showcase.arjun.coach@kheloindore.test", mobile: 9400000303, trainer_type: "Cricket Coach", category: "Cricket", category_type: "Cricket", gender: "Male", age: 36, price: 1500, experience: 12, venue_name: venues[2].name, near_by_location: "Palasia", address: "18 Race Course Road, Palasia", specializations: "Batting, Fast bowling, Match preparation, Academy trials", skills: "Video analysis, Bowling workload management, Fielding drills", qualifications: "BCCI Level 2 Coach\nFormer State Cricket Player\nB.P.Ed", bio: "Arjun develops technically sound cricketers through focused individual sessions and high-quality match simulations.", languages: ["Hindi", "English"], class_location: venues[2].name, training_mode: "Offline", students_trained: 380, profile_picture: [image(assets.coachA)], gallery: [image(assets.coachA), image(assets.venueC)], membership_plans: membershipPlans(1800), package: { monthly: 6500, quarterly: 18500, yearly: 70000 }, rating: 4.9, reviews_count: 61 },
    { ...clone(coachData[1]), first_name: "Meera", last_name: "Bose", email: "showcase.meera.coach@kheloindore.test", mobile: 9400000304, trainer_type: "Football Coach", category: "Football", category_type: "Football", gender: "Female", age: 31, price: 1300, experience: 8, venue_name: venues[3].name, near_by_location: "Rau", address: "32 Super Corridor, Rau", specializations: "Youth football, Ball control, Team tactics, Goal scoring", skills: "Agility, Small-sided games, Tactical coaching", qualifications: "AIFF D License\nB.P.Ed\nYouth Football Specialist", bio: "Meera runs energetic football sessions for young players and adult teams, with equal focus on confidence and game intelligence.", languages: ["Hindi", "English", "Bengali"], coaching_levels: ["Beginner", "Intermediate", "Advanced"], class_location: venues[3].name, training_mode: "Both", students_trained: 260, profile_picture: [image(assets.coachB)], gallery: [image(assets.coachB), image(assets.venueB)], membership_plans: membershipPlans(1550), package: { monthly: 5500, quarterly: 15600, yearly: 59000 }, rating: 4.8, reviews_count: 44 },
    { ...clone(coachData[0]), first_name: "Rohit", last_name: "Kulkarni", email: "showcase.rohit.coach@kheloindore.test", mobile: 9400000305, trainer_type: "Swimming Coach", category: "Swimming", category_type: "Swimming", gender: "Male", age: 33, price: 1250, experience: 10, venue_name: venues[0].name, near_by_location: "Vijay Nagar", address: "41 Sapphire Square, Vijay Nagar", specializations: "Learn to swim, Stroke correction, Endurance swimming, Triathlon preparation", skills: "Water confidence, Freestyle technique, Breathing drills", qualifications: "ASCA Level 2 Coach\nRed Cross Lifeguard\nB.P.Ed", bio: "Rohit helps children and adults become safe, efficient swimmers with patient step-by-step coaching.", languages: ["Hindi", "English", "Marathi"], coaching_levels: ["Beginner", "Intermediate"], class_location: venues[0].name, training_mode: "Offline", students_trained: 410, profile_picture: [image(assets.coachA)], gallery: [image(assets.coachA), image(assets.venueA)], membership_plans: membershipPlans(1500), package: { monthly: 5000, quarterly: 14200, yearly: 53000 }, rating: 4.7, reviews_count: 52 },
    { ...clone(coachData[1]), first_name: "Tanya", last_name: "Arora", email: "showcase.tanya.coach@kheloindore.test", mobile: 9400000306, trainer_type: "Basketball Coach", category: "Basketball", category_type: "Basketball", gender: "Female", age: 28, price: 1150, experience: 6, venue_name: "Indore Hoops Academy", near_by_location: "Scheme 54", address: "8 Scheme 54, Indore", specializations: "Shooting form, Dribbling, Team defense, School tournaments", skills: "Footwork, Shooting mechanics, Youth development", qualifications: "FIBA Level 1 Coach\nB.P.Ed\nFirst Aid Certified", bio: "Tanya makes basketball learning exciting through skill games, structured drills and supportive group coaching.", languages: ["Hindi", "English"], coaching_levels: ["Beginner", "Intermediate"], class_location: "Indore Hoops Academy", training_mode: "Offline", students_trained: 160, profile_picture: [image(assets.coachB)], gallery: [image(assets.coachB), image(assets.galleryB)], membership_plans: membershipPlans(1350), package: { monthly: 4700, quarterly: 13400, yearly: 50000 }, rating: 4.6, reviews_count: 31 }
  );

  const trainerData = [
    { first_name: "Ira", last_name: "Menon", email: "showcase.ira.trainer@kheloindore.test", mobile: 9400000401, trainer_type: "Personal Trainer", category: "Strength Training", category_type: "Fitness", gender: "Female", age: 30, date_of_birth: "1996-04-21", price: 1300, experience: 8, venue_name: venues[0].name, near_by_location: "Vijay Nagar", address: "41 Sapphire Square, Vijay Nagar", city: "Indore", state: "Madhya Pradesh", zipcode: "452010", location: { address: "41 Sapphire Square, Vijay Nagar", city: "Indore", state: "Madhya Pradesh", zipcode: "452010", google_location: "https://maps.google.com/?q=22.7533,75.8937" }, specializations: ["Strength Training", "Women Fitness", "Mobility", "Posture Correction"], skills: "Progressive overload, Functional movement, Nutrition basics", qualifications: "ACE Certified Personal Trainer\nSports Nutrition Specialist\nRYT-200 Yoga Teacher", bio: "Ira helps busy professionals build strength, energy and sustainable routines with supportive, measurable training plans.", languages: ["Hindi", "English", "Malayalam"], sports: ["Fitness", "Yoga"], coaching_levels: ["Beginner", "Intermediate", "Advanced"], training_levels: ["Beginner", "Intermediate", "Advanced"], own_level: "Advanced", response_time: "Within 2 hours", class_location: venues[0].name, training_mode: "Both", training_formats: ["Individual Training", "Group Training"], group_size_max: 12, age_groups: ["Teenagers", "Adults", "Seniors"], session_durations: [1, 2], availability_options: ["Morning", "Evening", "Online Training", "Trial Session"], pricing: { price_per_session: 1300, price_per_hour: 1300, monthly: 6000, quarterly: 17100, yearly: 66000, trial_session_price: 500 }, professional_experiences: [{ previous_club_or_academy: "Indore Aqua & Fitness Club", notable_teams_or_players: "Corporate wellness cohorts", tournaments_won: "", championships_or_awards: "Top trainer recognition 2025", years_playing_experience: 12, years_training_experience: 8 }], certifications: ["ACE CPT", "Sports Nutrition Specialist", "RYT-200"], achievements_awards: ["Trained 300+ members", "Top trainer recognition 2025"], verification_documents: { government_id: [image(assets.trainerA)], coaching_certificates: [image(assets.galleryA)], sports_qualifications: [image(assets.galleryB)], experience_proofs: [image(assets.trainerA)] }, training_photos: [image(assets.trainerA), image(assets.galleryA)], certificate_achievement_photos: [image(assets.galleryB)], profile_picture: [image(assets.trainerA)], identity_Proof: [image(assets.trainerA)], other_document: [image(assets.galleryA)], gallery: [image(assets.trainerA), image(assets.galleryA)], gallery_videos: [], daily_availability: availability, membership_plans: membershipPlans(1700), package: { monthly: 6000, quarterly: 17100, yearly: 66000 }, availability: "Monday to Saturday, 6:00 AM - 9:00 PM", policiesAndRules: "Wear comfortable exercise clothing. Share medical conditions before your first session. Cancel at least six hours ahead.", role: "Personal Trainer", status: true, verification_status: 1, is_admin_access: 1, awaiting_approval: false, isUpdated: true, students_trained: 310, rating: 4.9, reviews_count: 54, social_media: { instagram: "https://instagram.com/kheloindore", facebook: "", youtube: "", twitter: "", linkedin: "" } },
    { first_name: "Vikram", last_name: "Sethi", email: "showcase.vikram.trainer@kheloindore.test", mobile: 9400000402, trainer_type: "Personal Trainer", category: "Sports Conditioning", category_type: "Fitness", gender: "Male", age: 34, date_of_birth: "1992-10-12", price: 1500, experience: 10, venue_name: venues[1].name, near_by_location: "Nipania", address: "9 Orbit Mall Road, Scheme 140", city: "Indore", state: "Madhya Pradesh", zipcode: "452016", location: { address: "9 Orbit Mall Road, Scheme 140", city: "Indore", state: "Madhya Pradesh", zipcode: "452016", google_location: "https://maps.google.com/?q=22.7215,75.8852" }, specializations: ["Sports Conditioning", "Fat Loss", "HIIT", "Athletic Recovery"], skills: "Speed development, Power programming, Mobility assessment", qualifications: "NSCA Certified Strength Coach\nK11 Personal Training Diploma\nCPR and First Aid", bio: "Vikram combines strength, speed and recovery methods to help athletes and everyday members perform at their best.", languages: ["Hindi", "English", "Punjabi"], sports: ["Fitness", "Football", "Cricket"], coaching_levels: ["Intermediate", "Advanced"], training_levels: ["Intermediate", "Advanced"], own_level: "Advanced", response_time: "Within 6 hours", class_location: venues[1].name, training_mode: "Offline", training_formats: ["Individual Training", "Group Training"], group_size_max: 15, age_groups: ["Teenagers", "Adults"], session_durations: [1, 2, 3], availability_options: ["Morning", "Evening", "Home Training", "Trial Session"], pricing: { price_per_session: 1500, price_per_hour: 1500, monthly: 6900, quarterly: 19600, yearly: 75000, trial_session_price: 600 }, professional_experiences: [{ previous_club_or_academy: "SmashPad Pickleball Arena", notable_teams_or_players: "University football squad", tournaments_won: "Regional Fitness Challenge 2024", championships_or_awards: "Performance coach award", years_playing_experience: 15, years_training_experience: 10 }], certifications: ["NSCA Strength Coach", "K11 Personal Training", "CPR and First Aid"], achievements_awards: ["Regional Fitness Challenge 2024", "Performance coach award"], verification_documents: { government_id: [image(assets.trainerB)], coaching_certificates: [image(assets.galleryB)], sports_qualifications: [image(assets.galleryA)], experience_proofs: [image(assets.trainerB)] }, training_photos: [image(assets.trainerB), image(assets.galleryB)], certificate_achievement_photos: [image(assets.galleryA)], profile_picture: [image(assets.trainerB)], identity_Proof: [image(assets.trainerB)], other_document: [image(assets.galleryB)], gallery: [image(assets.trainerB), image(assets.galleryB)], gallery_videos: [], daily_availability: availability, membership_plans: membershipPlans(1900), package: { monthly: 6900, quarterly: 19600, yearly: 75000 }, availability: "Monday to Saturday, 6:00 AM - 9:00 PM", policiesAndRules: "Warm-up is mandatory. Sessions start on time. Inform the trainer of injuries or limitations before training.", role: "Personal Trainer", status: true, verification_status: 1, is_admin_access: 1, awaiting_approval: false, isUpdated: true, students_trained: 420, rating: 4.8, reviews_count: 46, social_media: { instagram: "https://instagram.com/kheloindore", facebook: "", youtube: "", twitter: "", linkedin: "" } },
  ];

  trainerData.push(
    { ...clone(trainerData[0]), first_name: "Anika", last_name: "Shah", email: "showcase.anika.trainer@kheloindore.test", mobile: 9400000403, category: "Yoga", category_type: "Yoga", gender: "Female", age: 32, price: 1000, experience: 9, venue_name: venues[5].name, near_by_location: "Old Palasia", address: "57 Saket Nagar, Old Palasia", specializations: ["Yoga", "Prenatal Fitness", "Breathwork", "Mobility"], skills: "Hatha yoga, Vinyasa flow, Meditation coaching", qualifications: "RYT-500 Yoga Teacher\nPrenatal Yoga Certified\nBreathwork Facilitator", bio: "Anika offers grounding yoga and mobility sessions for people seeking strength, flexibility and calmer daily routines.", sports: ["Yoga", "Fitness"], training_levels: ["Beginner", "Intermediate", "Advanced"], coaching_levels: ["Beginner", "Intermediate", "Advanced"], class_location: venues[5].name, training_mode: "Both", pricing: { price_per_session: 1000, price_per_hour: 1000, monthly: 4500, quarterly: 12800, yearly: 49000, trial_session_price: 350 }, membership_plans: membershipPlans(1250), package: { monthly: 4500, quarterly: 12800, yearly: 49000 }, profile_picture: [image(assets.trainerA)], gallery: [image(assets.trainerA), image(assets.galleryA)], training_photos: [image(assets.trainerA), image(assets.galleryA)], rating: 4.9, reviews_count: 68, students_trained: 520 },
    { ...clone(trainerData[1]), first_name: "Kunal", last_name: "Bhatia", email: "showcase.kunal.trainer@kheloindore.test", mobile: 9400000404, category: "Weight Loss", category_type: "Fitness", gender: "Male", age: 35, price: 1400, experience: 11, venue_name: venues[0].name, near_by_location: "Vijay Nagar", address: "41 Sapphire Square, Vijay Nagar", specializations: ["Weight Loss", "Metabolic Conditioning", "Nutrition Habits", "Strength Basics"], skills: "Body composition coaching, Habit building, Functional circuits", qualifications: "NASM CPT\nPrecision Nutrition Level 1\nK11 Personal Training", bio: "Kunal creates practical fat-loss plans that fit real schedules and build long-term habits, not quick fixes.", sports: ["Fitness"], training_levels: ["Beginner", "Intermediate"], coaching_levels: ["Beginner", "Intermediate"], class_location: venues[0].name, training_mode: "Both", pricing: { price_per_session: 1400, price_per_hour: 1400, monthly: 6300, quarterly: 17900, yearly: 68000, trial_session_price: 500 }, membership_plans: membershipPlans(1750), package: { monthly: 6300, quarterly: 17900, yearly: 68000 }, profile_picture: [image(assets.trainerB)], gallery: [image(assets.trainerB), image(assets.galleryB)], training_photos: [image(assets.trainerB), image(assets.galleryB)], rating: 4.8, reviews_count: 59, students_trained: 610 },
    { ...clone(trainerData[0]), first_name: "Devika", last_name: "Nair", email: "showcase.devika.trainer@kheloindore.test", mobile: 9400000405, category: "HIIT", category_type: "Fitness", gender: "Female", age: 27, price: 1200, experience: 6, venue_name: venues[1].name, near_by_location: "Nipania", address: "9 Orbit Mall Road, Scheme 140", specializations: ["HIIT", "Functional Training", "Pilates", "Core Strength"], skills: "Circuit design, Low-impact HIIT, Group motivation", qualifications: "K11 Personal Trainer\nPilates Mat Certified\nCPR and First Aid", bio: "Devika leads efficient, upbeat HIIT and functional training sessions suitable for both first-timers and experienced members.", sports: ["Fitness", "Pilates"], training_levels: ["Beginner", "Intermediate"], coaching_levels: ["Beginner", "Intermediate"], class_location: venues[1].name, training_mode: "Offline", pricing: { price_per_session: 1200, price_per_hour: 1200, monthly: 5400, quarterly: 15300, yearly: 58000, trial_session_price: 400 }, membership_plans: membershipPlans(1450), package: { monthly: 5400, quarterly: 15300, yearly: 58000 }, profile_picture: [image(assets.trainerA)], gallery: [image(assets.trainerA), image(assets.galleryB)], training_photos: [image(assets.trainerA), image(assets.galleryB)], rating: 4.7, reviews_count: 37, students_trained: 280 },
    { ...clone(trainerData[1]), first_name: "Manav", last_name: "Joshi", email: "showcase.manav.trainer@kheloindore.test", mobile: 9400000406, category: "Zumba", category_type: "Fitness", gender: "Male", age: 29, price: 900, experience: 7, venue_name: venues[5].name, near_by_location: "Old Palasia", address: "57 Saket Nagar, Old Palasia", specializations: ["Zumba", "Dance Fitness", "Cardio", "Group Classes"], skills: "Choreography, Group energy, Cardio programming", qualifications: "ZIN Zumba Instructor\nGroup Fitness Certified\nFirst Aid", bio: "Manav brings fun, inclusive dance-fitness classes that make cardio a weekly highlight for every age group.", sports: ["Zumba", "Fitness"], training_levels: ["Beginner", "Intermediate"], coaching_levels: ["Beginner", "Intermediate"], class_location: venues[5].name, training_mode: "Offline", pricing: { price_per_session: 900, price_per_hour: 900, monthly: 3900, quarterly: 11000, yearly: 42000, trial_session_price: 300 }, membership_plans: membershipPlans(1100), package: { monthly: 3900, quarterly: 11000, yearly: 42000 }, profile_picture: [image(assets.trainerB)], gallery: [image(assets.trainerB), image(assets.galleryA)], training_photos: [image(assets.trainerB), image(assets.galleryA)], rating: 4.6, reviews_count: 34, students_trained: 340 }
  );

  const firstNames = ["Aarav", "Diya", "Kabir", "Meera", "Vivaan", "Anaya"];
  const lastNames = ["Sharma", "Verma", "Singh", "Patel", "Mehta", "Nair"];
  const allCoachData = COACH_TRAINER_CATEGORIES.flatMap((category, categoryIndex) =>
    Array.from({ length: 6 }, (_, copyIndex) => {
      const serial = categoryIndex * 6 + copyIndex + 1;
      const template = clone(coachData[serial % coachData.length]);
      const slug = toSlug(category);
      const venue = venues[serial % venues.length];
      return {
        ...template,
        first_name: firstNames[copyIndex], last_name: `${lastNames[copyIndex]} ${categoryIndex + 1}`,
        email: `showcase.coach.${slug}.${copyIndex + 1}@kheloindore.test`, mobile: 9002000000 + serial,
        trainer_type: `${category} Coach`, category, category_type: category,
        venue_name: venue.name, class_location: venue.name, near_by_location: venue.near_by_location,
        address: `${100 + serial} Coach Lane, Indore`, price: 700 + (serial % 8) * 100,
        specializations: `${category} fundamentals, Technique development, Match preparation, Beginner coaching`,
      };
    })
  );
  const allTrainerData = COACH_TRAINER_CATEGORIES.flatMap((category, categoryIndex) =>
    Array.from({ length: 6 }, (_, copyIndex) => {
      const serial = categoryIndex * 6 + copyIndex + 1;
      const template = clone(trainerData[serial % trainerData.length]);
      const slug = toSlug(category);
      const venue = venues[serial % venues.length];
      return {
        ...template,
        first_name: firstNames[copyIndex], last_name: `${lastNames[copyIndex]} ${categoryIndex + 1}`,
        email: `showcase.trainer.${slug}.${copyIndex + 1}@kheloindore.test`, mobile: 9003000000 + serial,
        trainer_type: `${category} Trainer`, category, category_type: category,
        venue_name: venue.name, class_location: venue.name, near_by_location: venue.near_by_location,
        address: `${400 + serial} Training Street, Indore`, price: 600 + (serial % 8) * 100,
        specializations: [`${category} fundamentals`, "Technique development", "Fitness conditioning", "Beginner coaching"],
        sports: [category],
      };
    })
  );

  const coaches = [];
  for (const data of allCoachData) { await ensureUser({ ...data, password }); const coach = await saveProvider(Coach, data.email, { ...data, password: await bcrypt.hash(password, 10), demo_password: password }); coaches.push(coach); await seedCoachSlots(coach); }
  const trainers = [];
  for (const data of allTrainerData) { await ensureUser({ ...data, password }); const trainer = await saveProvider(Trainer, data.email, { ...data, password: await bcrypt.hash(password, 10), demo_password: password }); trainers.push(trainer); await seedTrainerSlots(trainer); }

  console.log(`Seeded/updated ${venues.length} venues, ${coaches.length} coaches, ${trainers.length} trainers and 62 days of slots for each.`);
  console.log("Provider login password: Demo@1234");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Showcase seed failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
