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

async function seedExcelAllTabs() {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected!');

  console.log('1. WIPING ALL OLD COLLECTIONS...');
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

  console.log('2. Preserving Super Admin & cleaning non-superadmin users...');
  const users = await User.find({});
  for (let u of users) {
    if (u.mobile !== 9999999999 && u.email !== 'iamsuperadmin@gmail.com') {
      await User.deleteOne({ _id: u._id });
    }
  }

  const filePath = path.join(__dirname, 'Khelo Indore Venue Data 2026.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error('Excel file not found at:', filePath);
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const defaultPassword = 'Kheloindore@123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const ownerLogins = [];
  let totalImported = 0;
  const createdCategories = new Set();
  const uniqueLocations = new Set();

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

    console.log(`Processing Tab: '${cleanCategoryName}' (${rawRows.length} rows)`);

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

      let price = 1000;
      if (venueSize.toLowerCase().includes('lakh')) price = 3000;

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
        images: [venueImage]
      });

      const standardSlots = [
        { startTime: '06:00 AM', endTime: '07:00 AM', price: price, isBooked: false },
        { startTime: '07:00 AM', endTime: '08:00 AM', price: price, isBooked: false },
        { startTime: '08:00 AM', endTime: '09:00 AM', price: price, isBooked: false },
        { startTime: '04:00 PM', endTime: '05:00 PM', price: price, isBooked: false },
        { startTime: '05:00 PM', endTime: '06:00 PM', price: price, isBooked: false },
        { startTime: '06:00 PM', endTime: '07:00 PM', price: price, isBooked: false },
        { startTime: '07:00 PM', endTime: '08:00 PM', price: price, isBooked: false },
        { startTime: '08:00 PM', endTime: '09:00 PM', price: price, isBooked: false }
      ];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let d = 0; d < 4; d++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + d);

        await Slot.create({
          venue_id: venueObj._id,
          date: slotDate,
          slots: standardSlots
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

  console.log(`\n3. Seeding ${uniqueLocations.size} unique locations...`);
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

  console.log('\n======================================================');
  console.log('COMPLETE WIPE & SEED SUCCESSFUL!');
  console.log(`Imported ${totalImported} Real Indore Venues across ${createdCategories.size} Categories`);
  console.log(`Default Owner Password: ${defaultPassword}`);
  console.log('Saved owner credentials to: backend/venue_logins_summary.json');
  console.log('======================================================\n');

  await mongoose.disconnect();
}

seedExcelAllTabs().catch(err => {
  console.error(err);
  process.exit(1);
});
