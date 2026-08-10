const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      
    })
    .catch((err) => {
      
      
      process.exit(1);
    });
};

module.exports = dbConnect;                                                                                                   
