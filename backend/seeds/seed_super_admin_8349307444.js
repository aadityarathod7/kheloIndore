const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const path = require("path");
const User = require("../models/UserModel");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mobile = process.env.SUPER_ADMIN_MOBILE;
const email = process.env.SUPER_ADMIN_LOGIN || process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;

async function seedSuperAdmin() {
  if (!mobile || !email || !password) {
    throw new Error("SUPER_ADMIN_LOGIN, SUPER_ADMIN_MOBILE, and SUPER_ADMIN_PASSWORD must be set in backend/.env.");
  }
  await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);

  const passwordHash = await bcrypt.hash(password, 12);
  const account = {
    first_name: "Super",
    last_name: "Admin",
    email,
    mobile,
    password: passwordHash,
    role: "Super Admin",
    status: true,
    is_admin_access: 1,
  };

  const existingUser = await User.findOne({ mobile });
  if (existingUser) {
    await User.updateOne({ _id: existingUser._id }, { $set: account });
    
  } else {
    await User.create(account);
    
  }

  await mongoose.disconnect();
}

seedSuperAdmin().catch(async (error) => {
  
  await mongoose.disconnect();
  process.exit(1);
});
