const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
