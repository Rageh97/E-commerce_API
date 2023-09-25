// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");
const CategoryModel = require("../Models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../Middlewares/uploadImageMiddleware");

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
  // save image into database
  req.body.image = fileName;
  next();
});

// @desc create category
// @route POST api/v1/categories
// @access private
exports.createCategory = factory.create(CategoryModel);
// @desc get list of categories
// @route GET api/v1/categories
// @access public
exports.getCategories = factory.getAll(CategoryModel);
// @desc get specific category
// @route GET api/v1/categories/:id
// @access public
exports.getSpecificCategory = factory.getOne(CategoryModel);
// @desc update specific category
// @route PUT api/v1/categories/:id
// @access private
exports.updateCategory = factory.update(CategoryModel);
// @desc delete category
// @route DELETE api/v1/categories/:id
// @access private
exports.deleteCategory = factory.delete(CategoryModel);
