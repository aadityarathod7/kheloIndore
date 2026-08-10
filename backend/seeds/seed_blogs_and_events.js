/**
 * Adds sample content for local development only.
 * Existing records with the same blog slug or event name are left unchanged.
 * Run: npm run seed:content
 */
const mongoose = require("mongoose");
require("dotenv").config();

const Blog = require("../models/BlogModel");
const Event = require("../models/EventModel");

const dateFromToday = (days, hour) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const blogs = [
  {
    slug_url: "best-cricket-grounds-in-indore",
    blog_title: "Best Cricket Grounds in Indore for Your Next Match",
    meta_title: "Best Cricket Grounds in Indore | Khelo Indore",
    meta_description: "Find cricket grounds in Indore with quality turf, lights, parking and easy online booking.",
    canonical_url: "/blog/best-cricket-grounds-in-indore",
    blog_image_alt: "Cricket players preparing for a match at a ground in Indore",
    blog_image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=85",
    meta_keywords: ["cricket grounds indore", "book cricket turf", "sports venues indore"],
    blog_description: "<p>Planning a friendly match or a serious tournament? Indore has great cricket grounds for every kind of player.</p><h2>What to check before booking</h2><p>Choose a venue with the right pitch, lighting, parking and time slots for your group. Book early for weekends and confirm the number of players in advance.</p><h2>Make match day simple</h2><p>Use Khelo Indore to compare venues, check availability and reserve your preferred slot online.</p>",
    status: "active",
  },
  {
    slug_url: "how-to-choose-a-personal-trainer",
    blog_title: "How to Choose the Right Personal Trainer in Indore",
    meta_title: "How to Choose a Personal Trainer in Indore | Khelo Indore",
    meta_description: "A practical guide to choosing a qualified personal trainer who matches your fitness goals.",
    canonical_url: "/blog/how-to-choose-a-personal-trainer",
    blog_image_alt: "Personal trainer guiding a fitness session",
    blog_image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85",
    meta_keywords: ["personal trainer indore", "fitness trainer", "gym training"],
    blog_description: "<p>The right trainer helps you stay consistent, safe and motivated.</p><h2>Start with your goal</h2><p>Decide whether you want strength, weight management, mobility or sports-specific training. Then look for a trainer with relevant experience.</p><h2>Ask the right questions</h2><p>Discuss availability, training style, experience and pricing before you begin. A good plan should suit your schedule and current fitness level.</p>",
    status: "active",
  },
  {
    slug_url: "badminton-beginners-guide",
    blog_title: "A Beginner's Guide to Playing Better Badminton",
    meta_title: "Badminton Beginner Tips | Khelo Indore",
    meta_description: "Build a strong badminton foundation with simple tips on grip, footwork and regular practice.",
    canonical_url: "/blog/badminton-beginners-guide",
    blog_image_alt: "Badminton racket and shuttlecock on an indoor court",
    blog_image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=85",
    meta_keywords: ["badminton tips", "badminton coaching indore", "indoor sports"],
    blog_description: "<p>Badminton is easy to start and rewarding to improve at with regular practice.</p><h2>Focus on footwork first</h2><p>Good movement helps you reach the shuttle early and play controlled shots. Practice small, quick steps and return to the centre of the court after each shot.</p><h2>Practice with purpose</h2><p>Spend a few minutes on serves, clears and rallies in every session. Small improvements add up quickly.</p>",
    status: "active",
  },
];

const events = [
  {
    event_name: "Khelo Indore Weekend Cricket Cup",
    description: "A friendly weekend cricket tournament for local teams. Register your squad and compete for the Khelo Indore Cup.",
    start_date: dateFromToday(14, 8),
    end_date: dateFromToday(15, 18),
    location: "Vijay Nagar, Indore",
    near_by_location: "Vijay Nagar",
    price: 1500,
    organized_by: "Khelo Indore",
    category: "Cricket",
    terms_and_conditions: "Team registration is required. Participants must report 30 minutes before their first match.",
    images: [{ src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=85", alt: "Cricket match on a green field" }],
    status: true,
  },
  {
    event_name: "Indore 5K Fitness Run",
    description: "Join runners and fitness enthusiasts for a community 5K run with warm-up sessions and finisher certificates.",
    start_date: dateFromToday(21, 6),
    end_date: dateFromToday(21, 10),
    location: "Regional Park, Indore",
    near_by_location: "Palasia",
    price: 299,
    organized_by: "Khelo Indore Fitness Community",
    category: "Running",
    terms_and_conditions: "Participants should bring a valid ID and wear suitable running shoes.",
    images: [{ src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85", alt: "Runners taking part in a community fitness run" }],
    status: true,
  },
  {
    event_name: "Badminton Doubles Challenge",
    description: "A doubles badminton challenge for beginners and intermediate players. Meet new partners and enjoy competitive games.",
    start_date: dateFromToday(28, 9),
    end_date: dateFromToday(28, 17),
    location: "Scheme 54, Indore",
    near_by_location: "Scheme 54",
    price: 499,
    organized_by: "Khelo Indore",
    category: "Badminton",
    terms_and_conditions: "Players must bring their own racket. Match format will be announced at check-in.",
    images: [{ src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=85", alt: "Badminton shuttlecock and racket" }],
    status: true,
  },
];

async function seed() {
  const mongoUri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/KheloIndore";
  await mongoose.connect(mongoUri);

  let createdBlogs = 0;
  let createdEvents = 0;
  let imagesAdded = 0;
  for (const blog of blogs) {
    const existing = await Blog.findOne({ slug_url: blog.slug_url });
    if (!existing) {
      await Blog.create(blog);
      createdBlogs += 1;
    } else if (!existing.blog_image) {
      await Blog.updateOne({ _id: existing._id }, { $set: { blog_image: blog.blog_image, blog_image_alt: blog.blog_image_alt } });
      imagesAdded += 1;
    }
  }
  for (const event of events) {
    const existing = await Event.findOne({ event_name: event.event_name });
    if (!existing) {
      await Event.create(event);
      createdEvents += 1;
    } else {
      const update = {};
      if (!existing.images?.length) { update.images = event.images; imagesAdded += 1; }
      if (!existing.category) update.category = event.category;
      if (Object.keys(update).length) await Event.updateOne({ _id: existing._id }, { $set: update });
    }
  }

  
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  
  await mongoose.disconnect();
  process.exit(1);
});
