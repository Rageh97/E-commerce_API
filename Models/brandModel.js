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
// for get, update , get one
brandSchema.post("init", (doc) => {
  // return respone of image with url
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});
// for create
brandSchema.post("save", (doc) => {
  // return respone of image with url
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});
//  create model
const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
