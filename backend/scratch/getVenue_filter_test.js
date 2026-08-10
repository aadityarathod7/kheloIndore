/* Throwaway verification for the extended /web/venue/getVenue filters.
   Uses the local KheloIndore DB (no production data written). */
const mongoose = require("mongoose");
require("dotenv").config();
const { getVenue } = require("../controllers/VenueController");

const call = (query) =>
  new Promise((resolve, reject) => {
    getVenue({ query }, { status: (c) => ({ json: (b) => resolve({ status: c, body: b }) }), json: (b) => resolve({ status: 200, body: b }) });
  });

const run = async () => {
  await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const cases = [
    ["no filters", {}],
    ["sport=cricket", { sport: "cricket" }],
    ["sport=football", { sport: "football" }],
    ["location=bhawar", { location: "Bhawar" }],
    ["grassType=natural", { grassType: "natural" }],
    ["grassType=artificial", { grassType: "artificial" }],
    ["grassType=box", { grassType: "box" }],
    ["amenities=Parking", { amenities: "Parking" }],
    ["date=2026-08-08", { date: "2026-08-08" }],
    ["date=2026-08-08&time=morning", { date: "2026-08-08", time: "morning" }],
    ["time=night", { time: "night" }],
    ["sort=price-low", { sort: "price-low" }],
    ["sort=price-high", { sort: "price-high" }],
  ];

  let pass = 0;
  for (const [label, query] of cases) {
    const r = await call(query);
    const arr = r.body.venue || [];
    const first = arr[0] || {};
    let ok = true;
    if (label.startsWith("sport=cricket")) {
      ok = arr.every((v) => /cricket|turf/i.test(`${v.vendor_type || ""} ${v.category || ""} ${v.name || ""}`));
    } else if (label.startsWith("sport=football")) {
      ok = arr.every((v) => /football/i.test(`${v.vendor_type || ""} ${v.category || ""} ${v.name || ""}`));
    } else if (label.startsWith("location")) {
      ok = arr.every((v) => (v.near_by_location || "").toLowerCase().includes("bhawar"));
    } else if (label === "grassType=natural") {
      ok = arr.every((v) => /ground|natural/i.test(`${v.vendor_type || ""} ${v.category || ""} ${v.name || ""}`));
    } else if (label === "grassType=artificial") {
      ok = arr.every((v) => /turf|astro|artificial/i.test(`${v.vendor_type || ""} ${v.category || ""} ${v.name || ""}`));
    } else if (label === "grassType=box") {
      ok = arr.every((v) => /box/i.test(`${v.vendor_type || ""} ${v.category || ""} ${v.name || ""}`));
    } else if (label === "amenities=Parking") {
      ok = arr.every((v) => (v.amenities || []).some((a) => /parking/i.test(a)));
    } else if (label === "sort=price-low") {
      const prices = arr.map((v) => v.price_per_hr || Infinity);
      ok = prices.every((p, i) => i === 0 || prices[i - 1] <= p);
    } else if (label === "sort=price-high") {
      const prices = arr.map((v) => v.price_per_hr || 0);
      ok = prices.every((p, i) => i === 0 || prices[i - 1] >= p);
    }
    if (ok) pass++;
    
  }
  
  await mongoose.disconnect();
  process.exit(pass === cases.length ? 0 : 1);
};

run().catch((e) => {
  
  process.exit(1);
});
