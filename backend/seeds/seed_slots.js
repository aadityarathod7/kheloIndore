/**
 * Khelo Indore — Slot Seed
 * Seeds time slots for the next 14 days for:
 *   - Venue (Slot model)   — 6am to 10pm in 1-hour blocks
 *   - Coach (CoachSlot)    — Monthly / Quarterly / Annually packages
 *   - Trainer (PersonalTrainerSlot) — Monthly / Quarterly / Annually packages
 *
 * Run: node seeds/seed_slots.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Slot             = require("../models/SlotModel");
const CoachSlot        = require("../models/CoachSlotsModel");
const PersonalTrainerSlot = require("../models/PersonalTrainerSlotModel");

const MONGO_URI = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/KheloIndore";

// ── IDs from the seed_test_data run ──────────────────────────────────────────
const VENUE_ID   = "6a6b1f6380018d9fbebb4fb4";
const COACH_ID   = "6a6b1f6380018d9fbebb4fb7";
const TRAINER_ID = "6a6b1f6380018d9fbebb4fba";

// ── Helpers ───────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");

/** Return array of Date objects for today + next N days */
function nextNDays(n) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(new Date(d));
  }
  return days;
}

/** Generate hourly slots from startHour to endHour at ₹price each */
function hourlySlots(startHour, endHour, price) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push({
      startTime: `${pad(h)}:00`,
      endTime:   `${pad(h + 1)}:00`,
      price,
      isBooked:  false,
    });
  }
  return slots;
}

/** Date N months from now */
function addMonths(date, m) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d;
}

/** Date N years from now */
function addYears(date, y) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + y);
  return d;
}

// ── Venue Slots (Slot model) ──────────────────────────────────────────────────
async function seedVenueSlots() {
  // Remove old slots for this venue to avoid duplicates
  await Slot.deleteMany({ venue_id: VENUE_ID });

  const days = nextNDays(30); // 30 days of slots
  const docs = days.map((day) => ({
    venue_id: new mongoose.Types.ObjectId(VENUE_ID),
    date:     day,
    slots:    hourlySlots(6, 23, 800), // 6am – 11pm, ₹800/hr
  }));

  await Slot.insertMany(docs);
  console.log(`✅ Venue slots seeded — ${docs.length} days × ${docs[0].slots.length} slots each`);
}

// ── Coach Slots (CoachSlot model) ─────────────────────────────────────────────
async function seedCoachSlots() {
  await CoachSlot.deleteMany({ coachId: COACH_ID });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // The coach offers three package types. Each package gets a slot entry
  // with a start/end date range and available time slots within each day.
  const packages = [
    {
      package_type: "Monthly",
      start_date:   today,
      end_date:     addMonths(today, 1),
      slots: [
        { start_time: "06:00", end_time: "07:00", price: 1500, isBooked: false },
        { start_time: "07:00", end_time: "08:00", price: 1500, isBooked: false },
        { start_time: "08:00", end_time: "09:00", price: 1500, isBooked: false },
        { start_time: "16:00", end_time: "17:00", price: 1500, isBooked: false },
        { start_time: "17:00", end_time: "18:00", price: 1500, isBooked: false },
        { start_time: "18:00", end_time: "19:00", price: 1500, isBooked: false },
        { start_time: "19:00", end_time: "20:00", price: 1500, isBooked: false },
      ],
    },
    {
      package_type: "Quarterly",
      start_date:   today,
      end_date:     addMonths(today, 3),
      slots: [
        { start_time: "06:00", end_time: "07:00", price: 1200, isBooked: false },
        { start_time: "07:00", end_time: "08:00", price: 1200, isBooked: false },
        { start_time: "08:00", end_time: "09:00", price: 1200, isBooked: false },
        { start_time: "16:00", end_time: "17:00", price: 1200, isBooked: false },
        { start_time: "17:00", end_time: "18:00", price: 1200, isBooked: false },
        { start_time: "18:00", end_time: "19:00", price: 1200, isBooked: false },
        { start_time: "19:00", end_time: "20:00", price: 1200, isBooked: false },
      ],
    },
    {
      package_type: "Annually",
      start_date:   today,
      end_date:     addYears(today, 1),
      slots: [
        { start_time: "06:00", end_time: "07:00", price: 900,  isBooked: false },
        { start_time: "07:00", end_time: "08:00", price: 900,  isBooked: false },
        { start_time: "08:00", end_time: "09:00", price: 900,  isBooked: false },
        { start_time: "16:00", end_time: "17:00", price: 900,  isBooked: false },
        { start_time: "17:00", end_time: "18:00", price: 900,  isBooked: false },
        { start_time: "18:00", end_time: "19:00", price: 900,  isBooked: false },
        { start_time: "19:00", end_time: "20:00", price: 900,  isBooked: false },
      ],
    },
  ];

  const docs = packages.map((p) => ({
    coachId:      new mongoose.Types.ObjectId(COACH_ID),
    package_type: p.package_type,
    start_date:   p.start_date,
    end_date:     p.end_date,
    slots:        p.slots,
    status:       true,
  }));

  await CoachSlot.insertMany(docs);
  console.log(`✅ Coach slots seeded — ${docs.length} packages (Monthly / Quarterly / Annually)`);
}

// ── Trainer Slots (PersonalTrainerSlot model) ─────────────────────────────────
async function seedTrainerSlots() {
  await PersonalTrainerSlot.deleteMany({ trainerId: TRAINER_ID });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const packages = [
    {
      package_type: "Monthly",
      start_date:   today,
      end_date:     addMonths(today, 1),
      slots: [
        { start_time: "05:30", end_time: "06:30", price: 1200, isBooked: false },
        { start_time: "06:30", end_time: "07:30", price: 1200, isBooked: false },
        { start_time: "07:30", end_time: "08:30", price: 1200, isBooked: false },
        { start_time: "08:30", end_time: "09:30", price: 1200, isBooked: false },
        { start_time: "17:00", end_time: "18:00", price: 1200, isBooked: false },
        { start_time: "18:00", end_time: "19:00", price: 1200, isBooked: false },
        { start_time: "19:00", end_time: "20:00", price: 1200, isBooked: false },
        { start_time: "20:00", end_time: "21:00", price: 1200, isBooked: false },
      ],
    },
    {
      package_type: "Quarterly",
      start_date:   today,
      end_date:     addMonths(today, 3),
      slots: [
        { start_time: "05:30", end_time: "06:30", price: 1000, isBooked: false },
        { start_time: "06:30", end_time: "07:30", price: 1000, isBooked: false },
        { start_time: "07:30", end_time: "08:30", price: 1000, isBooked: false },
        { start_time: "08:30", end_time: "09:30", price: 1000, isBooked: false },
        { start_time: "17:00", end_time: "18:00", price: 1000, isBooked: false },
        { start_time: "18:00", end_time: "19:00", price: 1000, isBooked: false },
        { start_time: "19:00", end_time: "20:00", price: 1000, isBooked: false },
        { start_time: "20:00", end_time: "21:00", price: 1000, isBooked: false },
      ],
    },
    {
      package_type: "Annually",
      start_date:   today,
      end_date:     addYears(today, 1),
      slots: [
        { start_time: "05:30", end_time: "06:30", price: 800,  isBooked: false },
        { start_time: "06:30", end_time: "07:30", price: 800,  isBooked: false },
        { start_time: "07:30", end_time: "08:30", price: 800,  isBooked: false },
        { start_time: "08:30", end_time: "09:30", price: 800,  isBooked: false },
        { start_time: "17:00", end_time: "18:00", price: 800,  isBooked: false },
        { start_time: "18:00", end_time: "19:00", price: 800,  isBooked: false },
        { start_time: "19:00", end_time: "20:00", price: 800,  isBooked: false },
        { start_time: "20:00", end_time: "21:00", price: 800,  isBooked: false },
      ],
    },
  ];

  const docs = packages.map((p) => ({
    trainerId:    new mongoose.Types.ObjectId(TRAINER_ID),
    package_type: p.package_type,
    start_date:   p.start_date,
    end_date:     p.end_date,
    slots:        p.slots,
    status:       true,
  }));

  await PersonalTrainerSlot.insertMany(docs);
  console.log(`✅ Trainer slots seeded — ${docs.length} packages (Monthly / Quarterly / Annually)`);
}

// ── Run ───────────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected\n🌱 Seeding slots...\n");
    return Promise.all([
      seedVenueSlots(),
      seedCoachSlots(),
      seedTrainerSlots(),
    ]);
  })
  .then(() => {
    console.log("\n══════════════════════════════════════════");
    console.log("✅  SLOT SEED COMPLETE");
    console.log("══════════════════════════════════════════");
    console.log("🏟  Venue  — 30 days × 17 hourly slots (6am–11pm) @ ₹800/hr");
    console.log("🏏  Coach  — Monthly / Quarterly / Annually packages");
    console.log("💪  Trainer — Monthly / Quarterly / Annually packages");
    console.log("══════════════════════════════════════════\n");
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Slot seed failed:", err);
    mongoose.disconnect();
    process.exit(1);
  });
