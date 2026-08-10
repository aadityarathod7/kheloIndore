const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
require("dotenv").config();
const dbConnect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/KheloIndore")
    .then(() => {
      
    })
    .catch((err) => {
      
      
      process.exit(1);
    });
};

dbConnect();
const createAdminSeed = async () => {
  try {
    const dataBody = {
      first_name: "Super ",
      last_name: "Admin",
      email: "superadmin@yopmail.com",
      role: "Super Admin",
      password: "",
      status: true,
    };

    let hashedPassword = await bcrypt.hash("admin", 12);
    dataBody.password = hashedPassword;
    const findData = await User.find({ mobile: "9999999999" });
    if (findData.length > 0) {
      
    } else {
      const data = await User.create({
        first_name: dataBody.first_name,
        last_name: dataBody.last_name,
        email: dataBody.email,
        role: dataBody.role,
        password: dataBody.password,
        status: dataBody.status,
        mobile: "9999999999",
      });
      
    }
  } catch (error) {
    
  }
};
createAdminSeed().then(() => {
});
