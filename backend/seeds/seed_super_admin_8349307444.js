const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const path = require("path");
const User = require("../models/UserModel");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mobile = "8349307444";
const password = "Kheloindore@2026";

async function seedSuperAdmin() {
  await mongoose.connect(process.env.DATABASE_URL);

  const passwordHash = await bcrypt.hash(password, 12);
  const account = {
    first_name: "Super",
    last_name: "Admin",
    email: "superadmin.8349307444@kheloindore.local",
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
