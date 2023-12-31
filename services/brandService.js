// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
  // save image into database
  req.body.image = fileName;
  next();
});
// @desc create Brands
// @route POST api/v1/brands
// @access private
exports.createBrand = factory.create(Brand);
// @desc get list of brands
// @route GET api/v1/brands
// @access public
exports.getBrands = factory.getAll(Brand);
// @desc get specific Brand
// @route GET api/v1/brands/:id
// @access public
exports.getSpecificBrand = factory.getOne(Brand);
// @desc update specific brand
// @route PUT api/v1/brands/:id
// @access private
exports.updateBrand = factory.update(Brand);
// @desc delete brand
// @route DELETE api/v1/brands/:id
// @access private
exports.deleteBrand = factory.delete(Brand);
