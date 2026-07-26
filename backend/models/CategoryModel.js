const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: [true, "Category is required"],
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      default: null,
  },
   parent_category_name:{
    type:String,
    required:true
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
