const mongoose = require("mongoose");

const ParentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentCategory", ParentCategorySchema);
