const mongoose = require("mongoose");
//  create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      require: [true, "category required"],
      unique: [true, "category must be required"],
      minlength: [3, "too short category name"],
      maxlength: [10, "too long category name"],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

//  create model
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
