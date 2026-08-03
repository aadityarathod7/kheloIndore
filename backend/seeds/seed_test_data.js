/**
 * Khelo Indore — Test Data Seed
 * Seeds: 1 Sports Venue (turf), 1 Coach, 1 Personal Trainer
 * All with full information ready for the complete booking flow.
 *
 * Run: node seeds/seed_test_data.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// ── Models ────────────────────────────────────────────────────────────────────
const Venue1  = require("../models/Venue1");
const Coach   = require("../models/CoachModel");
const Trainer = require("../models/PersonalTrainingModel");

// ── DB Connect ────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/KheloIndore";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => { console.error("❌ MongoDB error:", err.message); process.exit(1); });

// ── Helpers ───────────────────────────────────────────────────────────────────
const timeToday = (h, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

// ── Seed Functions ─────────────────────────────────────────────────────────────

async function seedVenue() {
  const existing = await Venue1.findOne({ name: "Khelo Indore Premier Turf" });
  if (existing) {
    console.log("⏭  Venue already seeded — ID:", existing._id.toString());
    return existing;
  }

  const venue = await Venue1.create({
    name:               "Khelo Indore Premier Turf",
    vendor_type:        "cricket-turf",
    category:           "Cricket Turf",
    address:            "Plot No. 12, Scheme 54, Vijay Nagar",
    city:               "Indore",
    state:              "Madhya Pradesh",
    zipcode:            "452010",
    near_by_location:   "Vijay Nagar",
    google_location:    "https://maps.google.com/?q=22.7533,75.8937",
    googleCoordinates:  { latitude: 22.7533, longitude: 75.8937 },
    contact_number:     "9826000001",
    other_contact_number: "9826000002",
    emailId:            "kheloturf@kheloindore.in",
    price_per_hr:       800,
    capacity:           22,
    status:             true,
    verification_status: 1,
    read_seen:          1,

    description: `Khelo Indore Premier Turf is one of Indore's finest cricket/football grounds 
featuring world-class synthetic turf, floodlights, and changing rooms. 
Perfect for corporate matches, weekend tournaments, and training sessions. 
Book your slot online in seconds and get instant confirmation!`,

    amenities: [
      "Floodlights",
      "Changing Rooms",
      "Parking",
      "Drinking Water",
      "First Aid",
      "Washrooms",
      "Scoreboard",
      "Seating Area",
    ],

    facilities: [
      "Synthetic Turf",
      "LED Floodlights",
      "Covered Seating",
      "Free Parking",
      "CCTV Security",
    ],

    gameType: "Cricket, Football, Box Cricket",

    package_type: ["Per Hour", "Half Day", "Full Day"],

    policiesAndRules: `1. Booking is confirmed only after payment.\n
2. Cancellation 24 hrs before slot gets full refund.\n
3. Spikes allowed on turf shoes only.\n
4. No food/beverages inside the ground.\n
5. Players must wear appropriate sportswear.\n
6. The management is not responsible for any injuries during play.\n
7. Maximum 22 players allowed on the ground at any time.`,

    additionalNotes: "Helmets and gloves available on request (nominal charges apply). Corporate event packages available—call us for custom pricing.",

    open_at:  timeToday(6, 0),
    close_at: timeToday(23, 0),

    // data map — used by venue-details page for game type display
    data: new Map([
      ["Cricket", [
        { key: "Pitch Type", value: "Synthetic Turf" },
        { key: "Pitch Size", value: "22 yards" },
        { key: "Max Players", value: "22" },
      ]],
      ["Football", [
        { key: "Ground Size", value: "Full Size" },
        { key: "Ground Type", value: "Artificial Grass" },
        { key: "Max Players", value: "22" },
      ]],
    ]),

    // Placeholder image paths — use any real URLs in production
    images: [
      { src: "/assets/img/venues/venue-01.jpg" },
      { src: "/assets/img/venues/venue-02.jpg" },
      { src: "/assets/img/venues/venue-03.jpg" },
    ],
  });

  console.log("✅ Venue seeded — ID:", venue._id.toString());
  return venue;
}

// ─────────────────────────────────────────────────────────────────────────────

async function seedCoach() {
  const existing = await Coach.findOne({ email: "rahul.sharma.coach@kheloindore.in" });
  if (existing) {
    existing.is_admin_access = 1;
    await existing.save();
    console.log("⏭  Coach updated & seeded — ID:", existing._id.toString());
    return existing;
  }

  const hashedPassword = await bcrypt.hash("Coach@1234", 10);

  const coach = await Coach.create({
    first_name:   "Rahul",
    last_name:    "Sharma",
    full_name:    "Rahul Sharma",
    email:        "rahul.sharma.coach@kheloindore.in",
    mobile:       9876543210,
    password:     hashedPassword,
    demo_password: "Coach@1234",

    venue_name:  "Khelo Indore Premier Turf",
    trainer_type: "Cricket Coach",
    role:         "Coach",
    status:       true,
    verification_status: 1,
    is_admin_access: 1,
    read_seen:    1,
    isUpdated:    true,

    age:           34,
    date_of_birth: "1990-05-15",
    gender:        "Male",
    experience:    10,
    price:         1500,

    address:   "23, Sports Colony, Vijay Nagar",
    city:      "Indore",
    state:     "Madhya Pradesh",
    zipcode:   "452010",

    location: {
      google_location: "https://maps.google.com/?q=22.7533,75.8937",
      address:         "23, Sports Colony, Vijay Nagar",
      city:            "Indore",
      state:           "Madhya Pradesh",
      zipcode:         "452010",
    },
    near_by_location: "Vijay Nagar",

    category:        "Cricket",
    category_type:   "Cricket",
    specializations: "Batting, Bowling, Fielding, Fitness",
    skills:          "Fast Bowling, Spin Bowling, Power Hitting, Wicket Keeping",
    languages:       "Hindi, English",

    qualifications: `• NCA Level 2 Certified Coach (BCCI)\n
• B.P.Ed from Devi Ahilya University, Indore\n
• Former Madhya Pradesh Ranji Trophy Player (2011–2019)\n
• Under-19 State Team Captain (2008)`,

    bio: `Coach Rahul Sharma is a BCCI-certified Level 2 cricket coach with over 10 years of 
professional coaching experience. A former Ranji Trophy player, he has trained over 
200 cricketers across all age groups. His coaching style emphasises technique, mental 
toughness, and match-specific skills. He currently coaches at Khelo Indore Premier Turf 
and offers individual, group, and advanced performance sessions.`,

    availability: "Monday to Saturday, 6:00 AM – 8:00 PM",

    policiesAndRules: `1. Session must be booked and paid for in advance.\n
2. Cancellation 12 hours before session — 50% refund.\n
3. No show / late cancellation — no refund.\n
4. Bring your own kit (bat, pads, gloves).\n
5. Sportswear mandatory during all sessions.\n
6. Video analysis sessions available on request.`,

    package: {
      monthly:   8000,
      quarterly: 22000,
      yearly:    80000,
    },

    startTime: timeToday(6, 0),
    endTime:   timeToday(20, 0),

    profile_picture: [{ src: "/assets/img/profiles/avatar-coach-01.jpg" }],
  });

  console.log("✅ Coach seeded — ID:", coach._id.toString());
  return coach;
}

// ─────────────────────────────────────────────────────────────────────────────

async function seedTrainer() {
  const existing = await Trainer.findOne({ email: "priya.fitness@kheloindore.in" });
  if (existing) {
    existing.is_admin_access = 1;
    await existing.save();
    console.log("⏭  Trainer updated & seeded — ID:", existing._id.toString());
    return existing;
  }

  const hashedPassword = await bcrypt.hash("Trainer@1234", 10);

  const trainer = await Trainer.create({
    first_name:    "Priya",
    last_name:     "Verma",
    email:         "priya.fitness@kheloindore.in",
    mobile:        9812345678,
    password:      hashedPassword,
    demo_password: "Trainer@1234",

    venue_name:   "FitZone Studio, Indore",
    trainer_type: "Personal Trainer",
    role:         "Personal Trainer",
    status:       true,
    is_admin_access: 1,
    read_seen:    1,
    isUpdated:    true,

    age:           28,
    date_of_birth: "1996-09-22",
    gender:        "Female",
    experience:    6,
    price:         1200,

    address:   "15, AB Road, Scheme 71",
    city:      "Indore",
    state:     "Madhya Pradesh",
    zipcode:   "452001",

    location: {
      google_location: "https://maps.google.com/?q=22.7196,75.8577",
      address:         "15, AB Road, Scheme 71",
      city:            "Indore",
      state:           "Madhya Pradesh",
      zipcode:         "452001",
    },
    near_by_location: "AB Road",

    category:        "Fitness & Wellness",
    category_type:   "Fitness",
    specializations: ["Weight Training", "HIIT", "Yoga", "Nutrition Coaching", "Zumba"],
    skills:          "Strength Training, Cardio, Flexibility, Weight Loss, Muscle Gain",
    languages:       "Hindi, English",

    qualifications: `• ACE Certified Personal Trainer\n
• Diploma in Sports Nutrition — Indore Sports Academy\n
• Certified Yoga Instructor (RYT-200)\n
• HIIT & Functional Training Specialist\n
• B.Sc. Physical Education — DAVV, Indore`,

    bio: `Priya Verma is a passionate fitness coach with 6+ years of experience helping 
clients achieve their health goals. She specialises in weight loss, muscle toning, 
HIIT workouts, and yoga-based flexibility training. Priya has helped 150+ clients 
transform their fitness journey with personalised plans and consistent motivation. 
She conducts both in-person and online sessions and creates customised diet + workout 
plans tailored to individual goals.`,

    availability: "Monday to Sunday, 5:30 AM – 9:00 PM",

    policiesAndRules: `1. All sessions must be pre-booked and paid.\n
2. Cancellations 6 hours before — 50% refund.\n
3. Rescheduling allowed once per booking.\n
4. Bring your own water bottle and yoga mat.\n
5. Wear comfortable workout clothes.\n
6. Medical conditions must be disclosed before first session.`,

    package: {
      monthly:   7000,
      quarterly: 19000,
      yearly:    70000,
    },

    startTime: timeToday(5, 30),
    endTime:   timeToday(21, 0),

    profile_picture: [{ src: "/assets/img/profiles/avatar-trainer-01.jpg" }],
    gallery:         [
      { src: "/assets/img/venues/venue-01.jpg" },
      { src: "/assets/img/venues/venue-02.jpg" },
    ],
  });

  console.log("✅ Trainer seeded — ID:", trainer._id.toString());
  return trainer;
}

async function seedAdditionalProfiles() {
  const password = await bcrypt.hash("Demo@1234", 10);
  const coachProfiles = [
    ["Aarav", "Mehta", "Cricket", "Male", "Vijay Nagar", 8, 1400],
    ["Kabir", "Singh", "Football", "Male", "Palasia", 7, 1300],
    ["Ananya", "Joshi", "Badminton", "Female", "Bhawarkuan", 6, 1200],
    ["Rohan", "Patel", "Tennis", "Male", "Rau", 9, 1500],
    ["Ishita", "Sharma", "Swimming", "Female", "Navlakha", 5, 1100],
    ["Vivaan", "Kulkarni", "Basketball", "Male", "Vijay Nagar", 7, 1350],
    ["Meera", "Nair", "Volleyball", "Female", "Bengali Square", 6, 1150],
    ["Arjun", "Verma", "Table Tennis", "Male", "LIG Square", 8, 1250],
    ["Kavya", "Gupta", "Fitness", "Female", "Nipania", 5, 1000],
  ];
  const trainerProfiles = [
    ["Riya", "Kapoor", "Weight Loss", "Female", "Palasia", 6, 1100],
    ["Aditya", "Rao", "Strength Training", "Male", "Vijay Nagar", 8, 1400],
    ["Nisha", "Jain", "Yoga", "Female", "Bhawarkuan", 7, 1200],
    ["Siddharth", "Mishra", "HIIT", "Male", "Rau", 5, 1250],
    ["Pooja", "Saxena", "Zumba", "Female", "Navlakha", 6, 1050],
    ["Karan", "Malhotra", "Muscle Gain", "Male", "Vijay Nagar", 9, 1500],
    ["Sneha", "Tiwari", "Pilates", "Female", "Bengali Square", 5, 1150],
    ["Dev", "Chauhan", "Sports Conditioning", "Male", "LIG Square", 7, 1350],
    ["Aditi", "Bansal", "Functional Training", "Female", "Nipania", 6, 1200],
  ];

  const coachOperations = coachProfiles.map(([first_name, last_name, category, gender, near_by_location, experience, price], index) => ({
    updateOne: {
      filter: { email: `demo.coach.${index + 1}@kheloindore.in` },
      update: {
        $setOnInsert: {
          first_name, last_name, full_name: `${first_name} ${last_name}`,
          email: `demo.coach.${index + 1}@kheloindore.in`, mobile: 9000000001 + index,
          password, demo_password: "Demo@1234", role: "Coach", trainer_type: `${category} Coach`,
          category, category_type: category, gender, near_by_location, experience, price,
          city: "Indore", state: "Madhya Pradesh", zipcode: "452001", status: true,
          verification_status: 1, is_admin_access: 1, isUpdated: true, read_seen: 1,
          specializations: `${category} coaching, Technique, Performance training`,
          bio: `${first_name} is a certified ${category.toLowerCase()} coach offering personalised training in Indore.`,
          availability: "Monday to Saturday, 6:00 AM - 8:00 PM",
          profile_picture: [{ src: `https://i.pravatar.cc/300?img=${index + 10}` }],
        },
      },
      upsert: true,
    },
  }));

  const trainerOperations = trainerProfiles.map(([first_name, last_name, category, gender, near_by_location, experience, price], index) => ({
    updateOne: {
      filter: { email: `demo.trainer.${index + 1}@kheloindore.in` },
      update: {
        $setOnInsert: {
          first_name, last_name, email: `demo.trainer.${index + 1}@kheloindore.in`, mobile: 9100000001 + index,
          password, demo_password: "Demo@1234", role: "Personal Trainer", trainer_type: "Personal Trainer",
          category, category_type: category, gender, near_by_location, experience, price,
          city: "Indore", state: "Madhya Pradesh", zipcode: "452001", status: true,
          is_admin_access: 1, isUpdated: true, read_seen: 1,
          specializations: [category, "Fitness Assessment", "Personalised Plans"],
          bio: `${first_name} is a certified personal trainer specialising in ${category.toLowerCase()}.`,
          availability: "Monday to Saturday, 6:00 AM - 9:00 PM",
          profile_picture: [{ src: `https://i.pravatar.cc/300?img=${index + 40}` }],
        },
      },
      upsert: true,
    },
  }));

  const [coachResult, trainerResult] = await Promise.all([
    Coach.bulkWrite(coachOperations),
    Trainer.bulkWrite(trainerOperations),
  ]);
  console.log(`Demo profiles ready: ${coachResult.upsertedCount || 0} coaches and ${trainerResult.upsertedCount || 0} trainers added.`);
}

const CoachSlot = require("../models/CoachSlotsModel");
const TrainerSlot = require("../models/PersonalTrainerSlotModel");

async function seedCoachSlots(coachId) {
  const existing = await CoachSlot.findOne({ coachId });
  if (existing) return;

  const today = new Date();
  for (let i = 0; i < 370; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`;

    const end = new Date(dateString);
    end.setMonth(d.getMonth() + 1);

    await CoachSlot.create({
      coachId,
      start_date: new Date(dateString),
      end_date: end,
      slots: [
        { start_time: "06:00 AM", end_time: "07:00 AM", price: 1500, isBooked: false },
        { start_time: "07:00 AM", end_time: "08:00 AM", price: 1500, isBooked: false },
        { start_time: "05:00 PM", end_time: "06:00 PM", price: 1500, isBooked: false }
      ],
      status: true
    });
  }
  console.log("✅ Coach Slots seeded");
}

async function seedTrainerSlots(trainerId) {
  const existing = await TrainerSlot.findOne({ trainerId });
  if (existing) return;

  const today = new Date();
  for (let i = 0; i < 370; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`;

    const end = new Date(dateString);
    end.setMonth(d.getMonth() + 1);

    await TrainerSlot.create({
      trainerId,
      start_date: new Date(dateString),
      end_date: end,
      slots: [
        { start_time: "06:00 AM", end_time: "07:00 AM", price: 1200, isBooked: false },
        { start_time: "07:00 AM", end_time: "08:00 AM", price: 1200, isBooked: false },
        { start_time: "06:00 PM", end_time: "07:00 PM", price: 1200, isBooked: false }
      ],
      status: true
    });
  }
  console.log("✅ Trainer Slots seeded");
}

// ── Run All ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Starting Khelo Indore test data seed...\n");

  if (process.argv.includes("--profiles-only")) {
    await seedCoach();
    await seedTrainer();
    await seedAdditionalProfiles();
    await mongoose.disconnect();
    return;
  }

  const venue   = await seedVenue();
  const coach   = await seedCoach();
  const trainer = await seedTrainer();
  await seedAdditionalProfiles();
  
  await seedCoachSlots(coach._id);
  await seedTrainerSlots(trainer._id);

  console.log("\n══════════════════════════════════════════");
  console.log("✅  SEED COMPLETE — Use these IDs to test:");
  console.log("══════════════════════════════════════════");
  console.log(`🏟  Venue   (cricket-turf): ${venue._id}`);
  console.log(`   URL: http://localhost:3000/sports-venue/cricket-turf/khelo-indore-premier-turf/${venue._id}`);
  console.log(`\n🏏  Coach  : ${coach._id}`);
  console.log(`   URL: http://localhost:3000/coaches/cricket/${coach.first_name.toLowerCase()}-${coach.last_name.toLowerCase()}/${coach._id}`);
  console.log(`\n💪  Trainer: ${trainer._id}`);
  console.log(`   URL: http://localhost:3000/personal-training/fitness/${trainer.first_name.toLowerCase()}-${trainer.last_name.toLowerCase()}/${trainer._id}`);
  console.log("══════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
