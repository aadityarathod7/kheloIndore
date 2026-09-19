const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = async () => {
  // Support the existing local configuration as well as DATABASE_URL used by
  // deployments. DATABASE_URL takes precedence when both are supplied.
  const databaseUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or MONGODB_URI is missing. Add one to backend/.env before starting the server.");
  }

  await mongoose.connect(databaseUrl);
  console.log("[Success] MongoDB connected.");

  try {
    const { backfillProviderPublicIds } = require("../helper/backfillProviderPublicIds");
    const result = await backfillProviderPublicIds();
    if (result.venues || result.coaches || result.trainers) console.log("[Success] Provider IDs assigned:", result);
  } catch (error) {
    console.error("Provider ID backfill failed:", error.message);
  }
};

module.exports = dbConnect;                                                                                                   
