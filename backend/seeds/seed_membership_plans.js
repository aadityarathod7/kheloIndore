require("dotenv").config();
const mongoose = require("mongoose");
const Venue = require("../models/Venue1");
const Coach = require("../models/CoachModel");
const Trainer = require("../models/PersonalTrainingModel");

const plans = [
  { name: "Monthly", months: 1, price: 1500, priority: "Standard Booking", discount: "Flexible Plan", support: "Basic Support", includes_coaching: true },
  { name: "Quarterly", months: 3, price: 4200, priority: "Priority Booking", discount: "Save 5%", support: "Member Support", includes_coaching: true },
  { name: "Half-Yearly", months: 6, price: 7800, priority: "Priority Booking", discount: "Save 10%", support: "Member Support", includes_coaching: true },
  { name: "Yearly", months: 12, price: 14400, priority: "High Priority Booking", discount: "Save 20%", support: "Premium Support", includes_coaching: true },
];

async function addPlans(Model, label, filter) {
  const provider = await Model.findOne(filter).sort({ createdAt: -1 });
  if (!provider) return console.log(`${label}: skipped (no provider found)`);
  if (Array.isArray(provider.membership_plans) && provider.membership_plans.length) return console.log(`${label}: skipped (plans already exist for ${provider._id})`);
  provider.membership_plans = plans;
  await provider.save();
  console.log(`${label}: added 4 test plans to ${provider._id}`);
}

async function seed() {
  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!uri) throw new Error("DATABASE_URL or MONGODB_URI is missing.");
  await mongoose.connect(uri);
  await addPlans(Venue, "Venue", { status: { $ne: false } });
  await addPlans(Coach, "Coach", { status: { $ne: false } });
  await addPlans(Trainer, "Trainer", { status: { $ne: false } });
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Membership seed failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
