// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);
    // save image into database
    req.body.image = fileName;
  }
  next();
});

// @desc create category
// @route POST api/v1/categories
// @access private
exports.createCategory = factory.create(Category);
// @desc get list of categories
// @route GET api/v1/categories
// @access public
exports.getCategories = factory.getAll(Category);
// @desc get specific category
// @route GET api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(Category);
// @desc update specific category
// @route PUT api/v1/categories/:id
// @access private
exports.updateCategory = factory.update(Category);
// @desc delete category
// @route DELETE api/v1/categories/:id
// @access private
exports.deleteCategory = factory.delete(Category);
