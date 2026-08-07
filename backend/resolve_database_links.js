const mongoose = require('mongoose');
const https = require('https');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/KheloIndore';

const VenueSchema = new mongoose.Schema({
  google_location: String,
  name: String
}, { strict: false });

const Venue = mongoose.model('Venue1', VenueSchema, 'venue1s');

const resolveRedirect = (url) => {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      return resolve(url);
    }
    const isShortUrl = url.includes("maps.app.goo.gl") || url.includes("share.google");
    if (!isShortUrl) {
      return resolve(url);
    }

    const follow = (currentUrl, depth = 0) => {
      if (depth > 5) {
        return resolve(currentUrl);
      }
      try {
        https.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            follow(res.headers.location, depth + 1);
          } else {
            resolve(currentUrl);
          }
        }).on('error', () => {
          resolve(currentUrl);
        });
      } catch (err) {
        resolve(currentUrl);
      }
    };

    follow(url);
  });
};

async function run() {
  try {
    console.log('Connecting to database:', dbUrl);
    await mongoose.connect(dbUrl);
    console.log('Connected!');

    const venues = await Venue.find({});
    console.log(`Found ${venues.length} venues total.`);

    let count = 0;
    for (const venue of venues) {
      const original = venue.google_location;
      if (original && (original.includes("maps.app.goo.gl") || original.includes("share.google"))) {
        console.log(`Resolving short link for venue "${venue.name || venue._id}": ${original}`);
        const resolved = await resolveRedirect(original);
        if (resolved !== original) {
          venue.google_location = resolved;
          await venue.save();
          console.log(`Updated to: ${resolved}`);
          count++;
        } else {
          console.log(`Could not resolve redirect, left unchanged.`);
        }
      }
    }

    console.log(`Migration finished. Updated ${count} venues.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
