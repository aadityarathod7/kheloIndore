const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/Dell/Downloads/kheloIndore-main (2)/kheloIndore-main/backend/.env' });

const dbUrl = process.env.DATABASE_URL;

const User = require('c:/Users/Dell/Downloads/kheloIndore-main (2)/kheloIndore-main/backend/models/UserModel.js');
const Coach = require('c:/Users/Dell/Downloads/kheloIndore-main (2)/kheloIndore-main/backend/models/CoachModel.js');

async function checkUsers() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB.');

    const users = await User.find({ role: 'Venue Admin' });
    console.log('--- Venue Admins ---');
    users.forEach(u => {
      console.log(`ID: ${u._id}, Mobile: ${u.mobile}, Role: ${u.role}, Status: ${u.status}, is_admin_access: ${u.is_admin_access}`);
    });

    const coaches = await Coach.find({});
    console.log('--- Coaches ---');
    coaches.forEach(c => {
      console.log(`ID: ${c._id}, Mobile: ${c.mobile}, Role: ${c.role}, Status: ${c.status}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();
