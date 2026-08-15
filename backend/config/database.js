const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(async () => {
      try {
        const { backfillProviderPublicIds } = require("../helper/backfillProviderPublicIds");
        const result = await backfillProviderPublicIds();
        if (result.venues || result.coaches || result.trainers) console.log("[Success] Provider IDs assigned:", result);
      } catch (error) {
        console.error("Provider ID backfill failed:", error.message);
      }
    })
    .catch((err) => {
      
      
      process.exit(1);
    });
};

module.exports = dbConnect;                                                                                                   
