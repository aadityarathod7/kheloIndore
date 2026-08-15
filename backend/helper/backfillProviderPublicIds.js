const Venue = require("../models/Venue1");
const LegacyVenue = require("../models/VenueModel");
const Coach = require("../models/CoachModel");
const PersonalTrainer = require("../models/PersonalTrainingModel");

async function assignMissingIds(Model) {
  const records = await Model.find({
    $or: [{ provider_public_id: { $exists: false } }, { provider_public_id: null }, { provider_public_id: "" }],
  });
  for (const record of records) await record.save();
  return records.length;
}

async function backfillVenuePublicIds() {
  const [venues, legacyVenues] = await Promise.all([assignMissingIds(Venue), assignMissingIds(LegacyVenue)]);
  return venues + legacyVenues;
}

async function backfillProviderPublicIds() {
  const [venues, legacyVenues, coaches, trainers] = await Promise.all([
    assignMissingIds(Venue),
    assignMissingIds(LegacyVenue),
    assignMissingIds(Coach),
    assignMissingIds(PersonalTrainer),
  ]);
  return { venues: venues + legacyVenues, coaches, trainers };
}

module.exports = { backfillProviderPublicIds, backfillVenuePublicIds };