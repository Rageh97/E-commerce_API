const mongoose = require("mongoose");
//  create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Brand required"],
      unique: [true, "Brand must be required"],
      minlength: [3, "too short Brand name"],
      maxlength: [30, "too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

//  create model
const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
