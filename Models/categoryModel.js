const mongoose = require("mongoose");
//  create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "category required"],
      unique: [true, "category must be required"],
      minlength: [3, "too short category name"],
      maxlength: [30, "too long category name"],
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
categorySchema.post("init", (doc) => {
  // return respone of image with url
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});
// for create
categorySchema.post("save", (doc) => {
  // return respone of image with url
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});

//  create model
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
