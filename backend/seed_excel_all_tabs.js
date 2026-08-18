const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/UserModel');
const Venue = require('./models/Venue1');
const Slot = require('./models/SlotModel');
const Coach = require('./models/CoachModel');
const CoachSlot = require('./models/CoachSlotsModel');
const CoachBooking = require('./models/CoachBookingModel');
const PT = require('./models/PersonalTrainingModel');
const PTSlot = require('./models/PersonalTrainerSlotModel');
const PTBooking = require('./models/PersonalTrainerBookingModel');
const Booking = require('./models/BookingModel');
const Category = require('./models/CategoryModel');
const Transaction = require('./models/TransactionModel');
const Refund = require('./models/RefundModel');
const NearbyLocation = require('./models/NearByLocationModel');

const categoryImages = {
  'turf': 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80',
  'cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
  'football': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
  'swiming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
  'yoga': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'zumba': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'dance': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  'volleyball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80',
  'pickleball': 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&auto=format&fit=crop&q=80',
  'tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80',
  'skating': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
  'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
  'bowling': 'https://images.unsplash.com/photo-1538388149542-5e24932d11a8?w=800&auto=format&fit=crop&q=80',
  'chess': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80',
  'horse': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&auto=format&fit=crop&q=80',
  'karting': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80'
};

function getCategoryImage(catName, sportName) {
  const key = (catName + ' ' + sportName).toLowerCase();
  for (let k of Object.keys(categoryImages)) {
    if (key.includes(k)) return categoryImages[k];
  }
  return categoryImages['default'];
}

const timeToday = (h, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const SEED_DAYS = 30;

const formatTime = (hour, minute) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 || 12;
  return `${String(twelveHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
};

// A venue price is hourly in the admin form. Each generated slot is 30 minutes,
// so its booking price is half the hourly rate.
const createHalfHourSlots = (hourlyPrice, startHour = 6, endHour = 22) => {
  const halfHourPrice = Math.max(1, Math.round(Number(hourlyPrice || 0) / 2));
  const slots = [];

  for (let minutes = startHour * 60; minutes < endHour * 60; minutes += 30) {
    const endMinutes = minutes + 30;
    slots.push({
      startTime: formatTime(Math.floor(minutes / 60), minutes % 60),
      endTime: formatTime(Math.floor(endMinutes / 60), endMinutes % 60),
      price: halfHourPrice,
      isBooked: false,
    });
  }

  return slots;
};

const createHalfHourProviderSlots = (hourlyPrice, startHour = 6, endHour = 20) =>
  createHalfHourSlots(hourlyPrice, startHour, endHour).map((slot) => ({
    start_time: slot.startTime,
    end_time: slot.endTime,
    price: slot.price,
    isBooked: false,
  }));

const asNumber = (value, fallback) => {
  const parsed = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

async function seedCoach() {
  const existing = await Coach.findOne({ email: "rahul.sharma.coach@kheloindore.in" });
  if (existing) {
    existing.is_admin_access = 1;
    await existing.save();
    
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

    qualifications: `• NCA Level 2 Certified Coach (BCCI)\n\n• B.P.Ed from Devi Ahilya University, Indore\n\n• Former Madhya Pradesh Ranji Trophy Player (2011–2019)\n\n• Under-19 State Team Captain (2008)`,

    bio: `Coach Rahul Sharma is a BCCI-certified Level 2 cricket coach with over 10 years of professional coaching experience. A former Ranji Trophy player, he has trained over 200 cricketers across all age groups. His coaching style emphasises technique, mental toughness, and match-specific skills. He currently coaches at Khelo Indore Premier Turf and offers individual, group, and advanced performance sessions.`,

    availability: "Monday to Saturday, 6:00 AM – 8:00 PM",

    policiesAndRules: `1. Session must be booked and paid for in advance.\n\n2. Cancellation 12 hours before session — 50% refund.\n\n3. No show / late cancellation — no refund.\n\n4. Bring your own kit (bat, pads, gloves).\n\n5. Sportswear mandatory during all sessions.\n\n6. Video analysis sessions available on request.`,

    package: {
      monthly:   8000,
      quarterly: 22000,
      yearly:    80000,
    },

    startTime: timeToday(6, 0),
    endTime:   timeToday(20, 0),

    profile_picture: [{ src: "https://i.pravatar.cc/300?img=12" }],
  });

  
  return coach;
}

async function seedTrainer() {
  const existing = await PT.findOne({ email: "priya.fitness@kheloindore.in" });
  if (existing) {
    existing.is_admin_access = 1;
    await existing.save();
    
    return existing;
  }

  const hashedPassword = await bcrypt.hash("Trainer@1234", 10);

  const trainer = await PT.create({
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
    verification_status: 1,
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

    qualifications: `• ACE Certified Personal Trainer\n\n• Diploma in Sports Nutrition — Indore Sports Academy\n\n• Certified Yoga Instructor (RYT-200)\n\n• HIIT & Functional Training Specialist\n\n• B.Sc. Physical Education — DAVV, Indore`,

    bio: `Priya Verma is a passionate fitness coach with 6+ years of experience helping clients achieve their health goals. She specialises in weight loss, muscle toning, HIIT workouts, and yoga-based flexibility training. Priya has helped 150+ clients transform their fitness journey with personalised plans and consistent motivation. She conducts both in-person and online sessions and creates customised diet + workout plans tailored to individual goals.`,

    availability: "Monday to Sunday, 5:30 AM – 9:00 PM",

    policiesAndRules: `1. All sessions must be pre-booked and paid.\n\n2. Cancellations 6 hours before — 50% refund.\n\n3. Rescheduling allowed once per booking.\n\n4. Bring your own water bottle and yoga mat.\n\n5. Wear comfortable workout clothes.\n\n6. Medical conditions must be disclosed before first session.`,

    package: {
      monthly:   7000,
      quarterly: 19000,
      yearly:    70000,
    },

    startTime: timeToday(5, 30),
    endTime:   timeToday(21, 0),

    profile_picture: [{ src: "https://i.pravatar.cc/300?img=47" }],
    gallery:         [
      { src: "/assets/img/venues/venue-01.jpg" },
      { src: "/assets/img/venues/venue-02.jpg" },
    ],
  });

  
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
          verification_status: 1,
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
    PT.bulkWrite(trainerOperations),
  ]);
  
}

async function seedAllSlots() {
  
  const coaches = await Coach.find({});
  const trainers = await PT.find({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Seed Coach Slots
  const coachSlotDocs = [];
  for (const coach of coaches) {
    const coachId = coach._id;
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`;

      const end = new Date(dateString);
      end.setMonth(d.getMonth() + 1);

      coachSlotDocs.push({
        coachId,
        start_date: new Date(dateString),
        end_date: end,
        slots: createHalfHourProviderSlots(coach.price || 1500, 6, 20),
        status: true
      });
    }
  }

  if (coachSlotDocs.length > 0) {
    await CoachSlot.insertMany(coachSlotDocs);
    
  }

  // 2. Seed Personal Trainer Slots
  const trainerSlotDocs = [];
  for (const trainer of trainers) {
    const trainerId = trainer._id;
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`;

      const end = new Date(dateString);
      end.setMonth(d.getMonth() + 1);

      trainerSlotDocs.push({
        trainerId,
        start_date: new Date(dateString),
        end_date: end,
        slots: createHalfHourProviderSlots(trainer.price || 1200, 6, 21),
        status: true
      });
    }
  }

  if (trainerSlotDocs.length > 0) {
    await PTSlot.insertMany(trainerSlotDocs);
    
  }
}

async function seedExcelAllTabs() {
  console.log("Connecting to Database at " + process.env.DATABASE_URL + "...");
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected! Clearing old collections...");

  await Venue.deleteMany({});
  await Slot.deleteMany({});
  await Coach.deleteMany({});
  await CoachSlot.deleteMany({});
  await CoachBooking.deleteMany({});
  await PT.deleteMany({});
  await PTSlot.deleteMany({});
  await PTBooking.deleteMany({});
  await Booking.deleteMany({});
  await Transaction.deleteMany({});
  await Refund.deleteMany({});
  await Category.deleteMany({});

  const db = mongoose.connection.db;
  await db.collection('userdetailsatpayments').deleteMany({});
  await db.collection('vendors').deleteMany({});
  await db.collection('events').deleteMany({});
  await db.collection('blogs').deleteMany({});
  await db.collection('contacts').deleteMany({});
  await db.collection('enquiries').deleteMany({});
  await db.collection('nearbylocations').deleteMany({});

  const users = await User.find({});
  for (let u of users) {
    if (u.mobile !== 9999999999 && u.email !== 'iamsuperadmin@gmail.com') {
      await User.deleteOne({ _id: u._id });
    }
  }
  console.log("Old collections cleared successfully.");

  const filePath = path.join(__dirname, 'Khelo Indore Venue Data 2026.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error("Excel file not found at: " + filePath);
    process.exit(1);
  }

  console.log("Reading Excel file: " + filePath + "...");
  const workbook = XLSX.readFile(filePath);
  const defaultPassword = 'Kheloindore@123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const ownerLogins = [];
  let totalImported = 0;
  const createdCategories = new Set();
  const uniqueLocations = new Set();

  console.log("Importing venues from sheets...");
  for (let sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(worksheet);
    const cleanCategoryName = sheetName.trim();

    if (!createdCategories.has(cleanCategoryName)) {
      await Category.create({
        category_name: cleanCategoryName,
        parent_category_name: 'Sports & Fitness',
        images: [getCategoryImage(cleanCategoryName, cleanCategoryName)],
        status: true
      }).catch(err => {});
      createdCategories.add(cleanCategoryName);
    }

    

    for (let rawRow of rawRows) {
      const row = {};
      Object.keys(rawRow).forEach(k => {
        row[k.trim()] = rawRow[k];
      });

      const venueName = row['Venue Name'] || row['venue_name'] || row['Name'];
      if (!venueName) continue;

      const servingArea = row['Serving Area'] || row['Area'] || cleanCategoryName;
      if (servingArea && String(servingArea).trim()) {
        uniqueLocations.add(String(servingArea).trim());
      }
      const venueAddress = row['Venue Address'] || row['Address'] || 'Indore, Madhya Pradesh';
      let contactNumber = String(row['Contact Number'] || row['Owner Contact Number'] || row['Phone'] || '');
      contactNumber = contactNumber.replace(/[^0-9]/g, '');
      if (contactNumber.length > 10) contactNumber = contactNumber.slice(-10);
      if (contactNumber.length < 10) contactNumber = '98' + String(Math.floor(10000000 + Math.random() * 89999999));

      const mobileNum = Number(contactNumber);
      const venueSize = String(row['Venue Size'] || row['size'] || 'Standard');
      const sportsType = row['Sports Type'] || cleanCategoryName;
      const mapLocation = row['Map Location'] || '';
      const ownerName = row['Owner Name'] || (String(venueName).slice(0, 15) + ' Owner');

      let owner = await User.findOne({ mobile: mobileNum });
      if (!owner) {
        owner = await User.create({
          first_name: String(ownerName).split(' ')[0],
          last_name: String(ownerName).split(' ')[1] || 'Owner',
          email: `owner.${mobileNum}@kheloindore.com`,
          mobile: mobileNum,
          password: hashedPassword,
          demo_password: defaultPassword,
          role: 'Venue Admin',
          is_admin_access: 1,
          status: true
        });
      }

      let price = asNumber(
        row['Price Per Hour'] || row['Price per Hour'] || row['Hourly Rate'] || row['Price'],
        venueSize.toLowerCase().includes('lakh') ? 3000 : 1000
      );

      const venueImage = getCategoryImage(cleanCategoryName, sportsType);

      const venueObj = await Venue.create({
        name: String(venueName).trim(),
        near_by_location: String(servingArea).trim(),
        address: String(venueAddress).trim(),
        city: 'Indore',
        state: 'Madhya Pradesh',
        zipcode: '452001',
        category: String(sportsType).trim(),
        vendor_type: cleanCategoryName,
        price_per_hr: price,
        description: `${venueName} located at ${venueAddress}. Size: ${venueSize}. Ideal for ${sportsType}.`,
        vendor_id: owner._id,
        status: true,
        verification_status: 1,
        google_location: String(mapLocation).trim(),
        images: [venueImage],
        amenities: ['Parking', 'Drinking Water', 'Changing Room', 'First Aid'],
        facilities: ['Lighting', 'Security', 'Seating', 'Equipment Storage'],
        gameType: String(sportsType).trim(),
        capacity: asNumber(row['Capacity'] || row['Venue Capacity'], venueSize.toLowerCase().includes('large') ? 50 : 20),
        package_type: ['Hourly', 'Half-hour'],
        open_at: timeToday(6, 0),
        close_at: timeToday(22, 0),
        other_contact_number: contactNumber,
        emailId: `venue.${mobileNum}@kheloindore.com`,
        policiesAndRules: 'Booking is subject to availability. Partial payments are non-refundable. Full-payment cancellations made at least 4 hours before the booking receive a 75% refund.',
        additionalNotes: `Seeded from the ${cleanCategoryName} Excel tab.`,
        categories: [cleanCategoryName, String(sportsType).trim()],
        sports_details: [{ sport: String(sportsType).trim(), size: venueSize, price_per_hr: price }],
        videos: [],
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let d = 0; d < SEED_DAYS; d++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + d);

        await Slot.create({
          venue_id: venueObj._id,
          date: slotDate,
          slots: createHalfHourSlots(price, 6, 22)
        });
      }

      totalImported++;
      ownerLogins.push({
        category: cleanCategoryName,
        venue: venueName,
        owner: ownerName,
        mobile: mobileNum,
        password: defaultPassword
      });
    }
  }

  
  for (let locName of uniqueLocations) {
    await NearbyLocation.create({
      area_name: locName,
      status: true
    }).catch(err => {});
  }

  fs.writeFileSync(
    path.join(__dirname, 'venue_logins_summary.json'),
    JSON.stringify(ownerLogins, null, 2)
  );

  
  console.log("Seeding Coaches...");
  await seedCoach();
  console.log("Seeding Personal Trainers...");
  await seedTrainer();
  console.log("Seeding Additional Profiles...");
  await seedAdditionalProfiles();
  console.log("Seeding Venue Slots (this can take some time)...");
  await seedAllSlots();

  console.log("Disconnecting Mongoose...");
  await mongoose.disconnect();
  console.log("Database seeded successfully! Total venues imported: " + totalImported);
}

seedExcelAllTabs().catch(err => {
  console.error("Error seeding database: ", err);
  process.exit(1);
});
