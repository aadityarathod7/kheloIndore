/**
 * Seed 10 Blogs and 10 Events with real Unsplash images.
 * - Skips documents that already exist (idempotent).
 * - Updates missing images on already-existing records.
 * Run: node seeds/seed_blogs_events_10.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Blog = require("../models/BlogModel");
const Event = require("../models/EventModel");

/* ── helpers ─────────────────────────────────────────── */
const daysFromNow = (d, h = 9) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  dt.setHours(h, 0, 0, 0);
  return dt;
};

/* ── 10 Blogs ─────────────────────────────────────────── */
const blogs = [
  {
    slug_url: "best-cricket-grounds-indore-2026",
    blog_title: "Top Cricket Grounds in Indore for Your Next Big Match",
    meta_title: "Best Cricket Grounds in Indore 2026 | Khelo Indore",
    meta_description:
      "Discover the top cricket grounds in Indore with quality pitches, floodlights, parking and easy online booking via Khelo Indore.",
    canonical_url: "/blog/best-cricket-grounds-indore-2026",
    blog_image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Cricket players on a well-maintained ground in Indore",
    meta_keywords: ["cricket grounds indore", "cricket pitch booking", "sports venues indore"],
    status: "active",
    created_at: daysFromNow(-60),
    blog_description: `<p>Indore is a city that breathes cricket. Whether you're organising a casual Sunday match or a serious club tournament, the city has excellent venues to suit every need and budget.</p>
<h2>What makes a great cricket ground?</h2>
<p>The best grounds offer well-maintained pitches (matting or turf), adequate boundary distance, night-play lighting, a pavilion area and parking for teams. Always check these before you book.</p>
<h2>Planning your match day</h2>
<p>Book at least 48 hours in advance, especially for weekends. Confirm the number of overs, required equipment and whether drinks are available at the venue. A little planning goes a long way.</p>
<h2>Book smart with Khelo Indore</h2>
<p>Use the Khelo Indore platform to compare venues, view real photos, read reviews and lock in your preferred time slot — all in a few clicks.</p>`,
  },
  {
    slug_url: "how-to-choose-personal-trainer-indore",
    blog_title: "How to Choose the Right Personal Trainer in Indore",
    meta_title: "Choosing a Personal Trainer in Indore | Khelo Indore",
    meta_description:
      "A practical guide to finding a certified personal trainer in Indore who fits your goals, schedule and budget.",
    canonical_url: "/blog/how-to-choose-personal-trainer-indore",
    blog_image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Personal trainer demonstrating an exercise to a client",
    meta_keywords: ["personal trainer indore", "fitness coaching", "gym trainer"],
    status: "active",
    created_at: daysFromNow(-52),
    blog_description: `<p>A good personal trainer can be the difference between consistent progress and endless frustration. Here's how to find the right one for you in Indore.</p>
<h2>Define your goal first</h2>
<p>Whether it's weight loss, muscle building, marathon preparation or injury rehabilitation — knowing your goal helps you narrow down trainers with relevant specialisations.</p>
<h2>Check certifications and experience</h2>
<p>Look for trainers certified by recognised bodies. Ask about their experience with clients who have similar goals and health backgrounds as yours.</p>
<h2>Trial sessions matter</h2>
<p>Always request a trial session before committing. Use it to evaluate their communication style, punctuality, the quality of the programme design, and whether you feel comfortable training with them.</p>
<h2>Find certified trainers on Khelo Indore</h2>
<p>Browse verified personal trainers across Indore on Khelo Indore, compare ratings and book your first session with ease.</p>`,
  },
  {
    slug_url: "badminton-tips-for-beginners",
    blog_title: "6 Badminton Tips Every Beginner Must Know",
    meta_title: "Badminton Tips for Beginners | Khelo Indore",
    meta_description:
      "Start your badminton journey the right way with tips on grip, footwork, serves and consistent practice.",
    canonical_url: "/blog/badminton-tips-for-beginners",
    blog_image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Badminton racket and shuttlecock on an indoor court",
    meta_keywords: ["badminton tips", "badminton for beginners", "indoor sports indore"],
    status: "active",
    created_at: daysFromNow(-45),
    blog_description: `<p>Badminton is one of the most popular indoor sports in Indore. Starting correctly builds a strong foundation and makes the game far more enjoyable.</p>
<h2>1. Hold the racket correctly</h2>
<p>Use a relaxed forehand grip — imagine shaking someone's hand. Avoid gripping too tight; a loose wrist generates more power and control.</p>
<h2>2. Master your footwork first</h2>
<p>Good movement is the backbone of badminton. Practice the split-step, move efficiently to the shuttle and always return to the centre of the court.</p>
<h2>3. Keep your eye on the shuttle</h2>
<p>Track the shuttlecock from your opponent's racket to yours. Watching early lets you set up your position and choose your shot.</p>
<h2>4. Serve consistently</h2>
<p>A low and tight serve restricts your opponent's attack. Practice both low and flick serves until they feel natural.</p>
<h2>5. Practice with purpose</h2>
<p>Dedicate time to specific skills — serving, net play, clears and smashes — rather than just rallying aimlessly. Focused practice accelerates improvement.</p>
<h2>6. Play regularly</h2>
<p>Book an indoor court on Khelo Indore and commit to at least two sessions a week. Consistency is everything in racket sports.</p>`,
  },
  {
    slug_url: "football-fitness-training-guide",
    blog_title: "Football Fitness: A Complete Training Guide for Amateurs",
    meta_title: "Football Fitness Training Guide | Khelo Indore",
    meta_description:
      "Improve your football fitness with targeted drills, strength work and smart recovery strategies.",
    canonical_url: "/blog/football-fitness-training-guide",
    blog_image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Football player sprinting during a training session",
    meta_keywords: ["football training indore", "football fitness", "amateur football"],
    status: "active",
    created_at: daysFromNow(-38),
    blog_description: `<p>Football demands speed, endurance, strength and sharp decision-making. Amateur players who train smartly can significantly close the gap with more experienced opponents.</p>
<h2>Build your aerobic base</h2>
<p>Long runs and interval training improve your stamina so you can stay sharp in the final minutes of a match. Aim for 20–30 minutes of continuous running three times a week.</p>
<h2>Sprint and change direction</h2>
<p>Football involves repeated short sprints and sharp turns. Include ladder drills, cone exercises and shuttle runs in your sessions to develop agility.</p>
<h2>Strengthen your core and legs</h2>
<p>Squats, lunges and single-leg exercises build the leg power needed for shooting, jumping and tackling. A strong core improves balance during physical challenges.</p>
<h2>Don't neglect recovery</h2>
<p>Sleep, hydration and a protein-rich diet are as important as training. Rest days are not optional — they are when your body adapts and improves.</p>`,
  },
  {
    slug_url: "swimming-benefits-for-all-ages",
    blog_title: "Why Swimming is One of the Best Sports for Every Age",
    meta_title: "Benefits of Swimming for All Ages | Khelo Indore",
    meta_description:
      "Swimming builds full-body strength, improves cardiovascular health and is gentle on your joints. Here's why you should start today.",
    canonical_url: "/blog/swimming-benefits-for-all-ages",
    blog_image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Swimmer gliding through a clear pool",
    meta_keywords: ["swimming benefits", "swimming pool indore", "aquatic fitness"],
    status: "active",
    created_at: daysFromNow(-30),
    blog_description: `<p>Swimming is one of the few sports that delivers a full-body workout while placing minimal stress on joints — making it ideal for children, adults and seniors alike.</p>
<h2>Cardiovascular and lung health</h2>
<p>Regular swimming strengthens your heart, improves lung capacity and reduces resting heart rate. Even 30 minutes in the pool three times a week produces measurable benefits.</p>
<h2>Muscle development without impact</h2>
<p>Water resistance tones muscles across your back, shoulders, arms, core and legs simultaneously. You build strength and endurance without the risk of impact injuries.</p>
<h2>Mental well-being</h2>
<p>The rhythmic nature of swimming, combined with controlled breathing, has a meditative quality that reduces stress and improves mood. Many swimmers report feeling calmer after a pool session.</p>
<h2>Ideal for rehabilitation</h2>
<p>Physiotherapists recommend swimming for patients recovering from knee, hip and lower-back conditions. The buoyancy of water reduces load while maintaining movement.</p>`,
  },
  {
    slug_url: "sports-nutrition-what-to-eat-before-after",
    blog_title: "Sports Nutrition: What to Eat Before and After a Match",
    meta_title: "Sports Nutrition Tips: Pre and Post Match Eating | Khelo Indore",
    meta_description:
      "Fuel your performance with the right foods before and after sport. Practical sports nutrition advice for active players in Indore.",
    canonical_url: "/blog/sports-nutrition-what-to-eat-before-after",
    blog_image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Healthy sports meal with fruits, vegetables and protein",
    meta_keywords: ["sports nutrition", "pre match meal", "post match recovery food"],
    status: "active",
    created_at: daysFromNow(-22),
    blog_description: `<p>What you eat directly affects your energy levels, concentration and recovery. Getting your nutrition right around matches gives you a genuine competitive advantage.</p>
<h2>Pre-match: fuel up smart</h2>
<p>Eat a balanced meal 2–3 hours before your match: complex carbohydrates (rice, whole wheat bread, oats) combined with lean protein (chicken, eggs, lentils) and a small amount of healthy fat. Avoid high-fat or high-fibre foods that digest slowly.</p>
<h2>30 minutes before: a light top-up</h2>
<p>A banana, a small handful of dates or a light sports drink can top up your glycogen stores without weighing you down. Stay well hydrated — aim for at least 500 ml of water in the hour before you play.</p>
<h2>Post-match: repair and recover</h2>
<p>Within 30–60 minutes of finishing, consume protein and carbohydrates together. A protein shake with a banana, or rice and chicken, helps repair muscle tissue and replenish energy stores quickly.</p>
<h2>Hydration is non-negotiable</h2>
<p>Dehydration of just 2% of body weight can impair performance by up to 20%. Sip water consistently throughout the day and during your match or training session.</p>`,
  },
  {
    slug_url: "yoga-for-athletes-indore",
    blog_title: "Why Athletes in Indore Are Turning to Yoga for Better Performance",
    meta_title: "Yoga for Athletes in Indore | Khelo Indore",
    meta_description:
      "Discover how yoga improves flexibility, focus and injury prevention for sports players in Indore.",
    canonical_url: "/blog/yoga-for-athletes-indore",
    blog_image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Athlete performing a yoga pose outdoors",
    meta_keywords: ["yoga for athletes", "sports yoga indore", "flexibility training"],
    status: "active",
    created_at: daysFromNow(-15),
    blog_description: `<p>More and more sportspeople across Indore — from cricketers to footballers to gym-goers — are adding yoga to their training routine. The results speak for themselves.</p>
<h2>Flexibility and range of motion</h2>
<p>Tight muscles limit performance and increase injury risk. Regular yoga stretches — held for 30–60 seconds — gradually increase flexibility in the hips, hamstrings, shoulders and spine.</p>
<h2>Balance and body awareness</h2>
<p>Standing poses like warrior and tree pose develop the single-leg balance and proprioception that are critical in almost every sport. Better balance means better control.</p>
<h2>Breathing and mental focus</h2>
<p>Controlled pranayama breathing improves lung capacity and teaches athletes to stay calm under pressure — an underrated but vital skill during close matches.</p>
<h2>Injury prevention</h2>
<p>Many sports injuries happen in fatigued muscles. A 15-minute yoga cooldown after training keeps muscles long and supple, significantly reducing the risk of strains and tears.</p>`,
  },
  {
    slug_url: "kids-sports-activities-indore",
    blog_title: "Best Sports Activities for Kids in Indore This Season",
    meta_title: "Sports Activities for Kids in Indore | Khelo Indore",
    meta_description:
      "Get your children active this season with the best sports classes, venues and events for kids across Indore.",
    canonical_url: "/blog/kids-sports-activities-indore",
    blog_image:
      "https://images.unsplash.com/photo-1529094344530-42f18774b873?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Children playing football on a green field",
    meta_keywords: ["kids sports indore", "children sports activities", "youth sports"],
    status: "active",
    created_at: daysFromNow(-8),
    blog_description: `<p>An active childhood builds lifelong habits. Indore offers a growing number of quality sports programmes for children across all age groups and interests.</p>
<h2>Why sport matters for children</h2>
<p>Regular physical activity improves children's fitness, concentration, social skills and emotional resilience. Studies show that active children perform better academically and report higher levels of happiness.</p>
<h2>Popular sports for kids in Indore</h2>
<p>Cricket, football, badminton, swimming and chess are among the most popular activities. Younger children (4–8 years) generally thrive in multi-skill programmes before specialising. Older children can begin structured coaching in their preferred sport.</p>
<h2>What to look for in a programme</h2>
<p>Choose coaches with experience working with children, age-appropriate facilities, small group sizes and a positive, encouraging atmosphere. Fun should always come before competition at the junior level.</p>
<h2>Find kids' sessions on Khelo Indore</h2>
<p>Use the Khelo Indore platform to browse children's sports classes, coaches and venues near you and book a trial session for your child today.</p>`,
  },
  {
    slug_url: "table-tennis-rise-in-indore",
    blog_title: "Table Tennis is Having a Moment in Indore — Here's Why",
    meta_title: "Table Tennis Growing Popularity in Indore | Khelo Indore",
    meta_description:
      "Table tennis is one of Indore's fastest growing indoor sports. Discover why so many players are picking up the paddle.",
    canonical_url: "/blog/table-tennis-rise-in-indore",
    blog_image:
      "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Table tennis player in action during a competitive match",
    meta_keywords: ["table tennis indore", "ping pong indore", "indoor sports"],
    status: "active",
    created_at: daysFromNow(-3),
    blog_description: `<p>Walk into any sports complex in Indore and you'll find table tennis tables occupied from morning to evening. The sport is experiencing a significant rise in participation across all age groups.</p>
<h2>Accessible and low cost</h2>
<p>Table tennis requires minimal equipment and can be played year-round indoors. A decent bat and a box of balls are all you need to get started. Venue booking costs are also significantly lower than outdoor sports.</p>
<h2>Incredible for fitness</h2>
<p>Table tennis is a superb full-body workout. Rapid directional changes, arm speed and coordination keep your heart rate elevated and sharpen your reflexes. A competitive session can burn over 300 calories per hour.</p>
<h2>Mental agility and concentration</h2>
<p>The speed of the sport demands constant focus and quick decision-making. Regular play has been shown to improve hand-eye coordination, reaction time and even cognitive function in older players.</p>
<h2>Community and tournaments</h2>
<p>Indore now hosts regular table tennis leagues and open tournaments. Find and book table tennis sessions and events through Khelo Indore and join the growing community.</p>`,
  },
  {
    slug_url: "stay-fit-monsoon-indoor-sports-indore",
    blog_title: "Stay Fit During Monsoon: Best Indoor Sports in Indore",
    meta_title: "Indoor Sports in Indore During Monsoon | Khelo Indore",
    meta_description:
      "Don't let the rain slow you down. Discover the best indoor sports venues in Indore to stay active all year.",
    canonical_url: "/blog/stay-fit-monsoon-indoor-sports-indore",
    blog_image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    blog_image_alt: "Players enjoying indoor sports during the monsoon season",
    meta_keywords: ["indoor sports indore", "monsoon fitness", "sports during rain"],
    status: "active",
    created_at: daysFromNow(-1),
    blog_description: `<p>Monsoon in Indore means waterlogged grounds and cancelled outdoor sessions. But staying active doesn't have to stop when the rain arrives. The city's indoor sports scene is excellent.</p>
<h2>Badminton</h2>
<p>Indoor badminton courts are never affected by weather. The sport is fast, fun and a fantastic full-body workout. Many venues in Indore offer hourly bookings — perfect for a quick evening session after work.</p>
<h2>Table Tennis</h2>
<p>Table tennis is completely weather-independent and hugely enjoyable at any skill level. It's a great option for groups looking for a competitive but low-impact activity.</p>
<h2>Squash</h2>
<p>Squash is one of the most intense cardio workouts available. 45 minutes of squash can burn more calories than most outdoor sessions. Indore has quality squash courts available for hourly booking.</p>
<h2>Swimming</h2>
<p>An indoor or covered pool is the ideal monsoon workout — cool, refreshing and highly effective for cardiovascular fitness. Many Indore venues have covered pool facilities available through Khelo Indore.</p>
<h2>Book your indoor session now</h2>
<p>Visit Khelo Indore to find the nearest indoor sports venue, check slot availability and book in seconds. Don't let monsoon break your fitness routine.</p>`,
  },
];

/* ── 10 Events ─────────────────────────────────────────── */
const events = [
  {
    event_name: "Khelo Indore Premier Cricket Cup 2026",
    description:
      "A flagship weekend cricket tournament open to all local teams. Compete for the Khelo Indore Premier Cup trophy, cash prizes and bragging rights across Indore.",
    start_date: daysFromNow(10, 8),
    end_date: daysFromNow(11, 18),
    location: "Nehru Stadium Ground, Indore",
    near_by_location: "City Centre",
    price: 2000,
    organized_by: "Khelo Indore",
    category: "Cricket",
    terms_and_conditions:
      "Teams of 11–15 players. Registration closes 3 days before event. Players must carry valid ID.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
        alt: "Cricket teams competing in a local tournament",
      },
    ],
  },
  {
    event_name: "Indore 5K & 10K Fitness Run 2026",
    description:
      "Run for health and community! Join hundreds of fitness enthusiasts for a scenic 5K and 10K route through Indore's green parks, with warm-up sessions, finisher medals and refreshments.",
    start_date: daysFromNow(17, 6),
    end_date: daysFromNow(17, 11),
    location: "Regional Park, Palasia, Indore",
    near_by_location: "Palasia",
    price: 399,
    organized_by: "Khelo Indore Fitness Community",
    category: "Running",
    terms_and_conditions:
      "Minimum age: 12 years. Bring a valid ID and wear appropriate running shoes. Timing chips will be provided at registration.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
        alt: "Participants running in a community 5K fitness event",
      },
    ],
  },
  {
    event_name: "Indore Badminton Doubles Championship",
    description:
      "Form your doubles pair and compete in one of Indore's most popular badminton tournaments. Open to beginner and intermediate players. All equipment available on site.",
    start_date: daysFromNow(24, 9),
    end_date: daysFromNow(24, 18),
    location: "Scheme 54 Indoor Sports Complex, Indore",
    near_by_location: "Scheme 54",
    price: 599,
    organized_by: "Khelo Indore Sports",
    category: "Badminton",
    terms_and_conditions:
      "Players must bring their own rackets. Shuttlecocks provided. Format announced at check-in.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
        alt: "Badminton doubles match in progress on an indoor court",
      },
    ],
  },
  {
    event_name: "Indore Open Football 7s Tournament",
    description:
      "Seven-a-side football for local clubs and pickup teams. Fast-paced, competitive and great fun. Prizes for winners and runners-up in two age categories.",
    start_date: daysFromNow(7, 16),
    end_date: daysFromNow(7, 21),
    location: "Vijay Nagar Football Ground, Indore",
    near_by_location: "Vijay Nagar",
    price: 1200,
    organized_by: "Khelo Indore",
    category: "Football",
    terms_and_conditions:
      "Teams of 7–10 players. Under-18 and Open categories available. Studs or astro turf boots recommended.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
        alt: "Football 7s match on a floodlit turf ground",
      },
    ],
  },
  {
    event_name: "Table Tennis Open League – Season 3",
    description:
      "Join Season 3 of the Indore Table Tennis Open League. Round-robin followed by knockout stages. Prizes, certificates and ranking points for all participants.",
    start_date: daysFromNow(14, 10),
    end_date: daysFromNow(15, 19),
    location: "Annapurna Indoor Sports Hall, Indore",
    near_by_location: "Annapurna",
    price: 350,
    organized_by: "Indore Table Tennis Association & Khelo Indore",
    category: "Table Tennis",
    terms_and_conditions:
      "ITTF-approved balls will be used. Bring your own bat. Registration includes two league matches minimum.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1200&q=80",
        alt: "Table tennis player competing in an indoor tournament",
      },
    ],
  },
  {
    event_name: "Khelo Indore Yoga & Wellness Day",
    description:
      "A full-day outdoor yoga and wellness event featuring group yoga sessions, meditation workshops, nutrition talks and a sports injury prevention clinic by certified professionals.",
    start_date: daysFromNow(21, 7),
    end_date: daysFromNow(21, 13),
    location: "Pipliyahana Lake Garden, Indore",
    near_by_location: "Vijay Nagar",
    price: 0,
    organized_by: "Khelo Indore Wellness",
    category: "Yoga",
    terms_and_conditions:
      "Free entry. Bring your own yoga mat. Pre-registration recommended to receive event schedule.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
        alt: "Group yoga session in an outdoor park setting",
      },
    ],
  },
  {
    event_name: "Kids Sports Carnival – Indore 2026",
    description:
      "A fun-filled sports carnival for children aged 5–15. Activities include mini cricket, football dribbling, relay races, swimming trials and a giant obstacle course.",
    start_date: daysFromNow(30, 9),
    end_date: daysFromNow(30, 16),
    location: "Brilliant Convention Centre Grounds, Indore",
    near_by_location: "A.B. Road",
    price: 200,
    organized_by: "Khelo Indore Youth",
    category: "Multi-Sport",
    terms_and_conditions:
      "Open to children aged 5–15. Parents must accompany children under 8. Nominal entry fee includes snacks and participation certificate.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1529094344530-42f18774b873?auto=format&fit=crop&w=1200&q=80",
        alt: "Children participating in a multi-sport carnival event",
      },
    ],
  },
  {
    event_name: "Indore Swimming Gala 2026",
    description:
      "Annual swimming competition featuring freestyle, breaststroke and relay events across junior and senior categories. Medals for the top three in each event.",
    start_date: daysFromNow(35, 8),
    end_date: daysFromNow(35, 15),
    location: "Navlakha Swimming Pool, Indore",
    near_by_location: "Navlakha",
    price: 250,
    organized_by: "Indore Amateur Swimming Association",
    category: "Swimming",
    terms_and_conditions:
      "Swimmers must bring their own swimwear and cap. Under-14 and Open age groups. Timings by FINA-approved electronic timekeeping.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
        alt: "Competitive swimmers racing in a swimming gala event",
      },
    ],
  },
  {
    event_name: "Corporate Sports League – Indore Q3",
    description:
      "Connect with colleagues and compete against other Indore companies in this multi-sport corporate league. Events include cricket, badminton, TT and a fun relay race.",
    start_date: daysFromNow(42, 9),
    end_date: daysFromNow(43, 18),
    location: "Daly College Sports Ground, Indore",
    near_by_location: "Residency Area",
    price: 5000,
    organized_by: "Khelo Indore Corporate",
    category: "Multi-Sport",
    terms_and_conditions:
      "Per-team registration. Minimum 15 participants per company. Includes jersey, lunch and evening gala.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
        alt: "Corporate teams competing in an indoor sports league",
      },
    ],
  },
  {
    event_name: "Monsoon Night Cricket Bash",
    description:
      "Don't let the rain stop the game! An exciting floodlit T10 cricket bash under covered turf, complete with live commentary, prizes and post-match refreshments.",
    start_date: daysFromNow(5, 19),
    end_date: daysFromNow(5, 23),
    location: "Indoor Cricket Arena, AB Road, Indore",
    near_by_location: "A.B. Road",
    price: 800,
    organized_by: "Khelo Indore",
    category: "Cricket",
    terms_and_conditions:
      "T10 format. Teams of 10 players. Equipment available on rent. Night cricket shoes recommended.",
    status: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
        alt: "Cricket match under floodlights at night",
      },
    ],
  },
];

/* ── Runner ─────────────────────────────────────────────── */
async function seed() {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    "mongodb://127.0.0.1:27017/KheloIndore";

  console.log(`\n🌱  Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);
  console.log("✅  Connected.\n");

  let createdBlogs = 0,
    updatedBlogs = 0,
    createdEvents = 0,
    updatedEvents = 0;

  /* ── Blogs ─── */
  console.log("📝  Seeding blogs…");
  for (const blog of blogs) {
    const existing = await Blog.findOne({ slug_url: blog.slug_url });
    if (!existing) {
      await Blog.create(blog);
      console.log(`   ✚ Created: "${blog.blog_title}"`);
      createdBlogs++;
    } else {
      const upd = {};
      if (!existing.blog_image && blog.blog_image) upd.blog_image = blog.blog_image;
      if (!existing.blog_image_alt && blog.blog_image_alt)
        upd.blog_image_alt = blog.blog_image_alt;
      if (Object.keys(upd).length) {
        await Blog.updateOne({ _id: existing._id }, { $set: upd });
        console.log(`   ↻ Updated image: "${blog.blog_title}"`);
        updatedBlogs++;
      } else {
        console.log(`   – Skip (exists): "${blog.blog_title}"`);
      }
    }
  }

  /* ── Events ─── */
  console.log("\n📅  Seeding events…");
  for (const event of events) {
    const existing = await Event.findOne({ event_name: event.event_name });
    if (!existing) {
      await Event.create(event);
      console.log(`   ✚ Created: "${event.event_name}"`);
      createdEvents++;
    } else {
      const upd = {};
      if (!existing.images?.length && event.images) upd.images = event.images;
      if (!existing.category && event.category) upd.category = event.category;
      if (Object.keys(upd).length) {
        await Event.updateOne({ _id: existing._id }, { $set: upd });
        console.log(`   ↻ Updated: "${event.event_name}"`);
        updatedEvents++;
      } else {
        console.log(`   – Skip (exists): "${event.event_name}"`);
      }
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🎉  Seed complete!
     Blogs   → created: ${createdBlogs}  updated: ${updatedBlogs}
     Events  → created: ${createdEvents}  updated: ${updatedEvents}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("❌  Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
