const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const BrandModel = require("../Models/brandModel");
const ApiError = require("../Utils/apiError");
// @desc create Brands
// @route POST api/v1/brands
// @access private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const Brand = await BrandModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({ data: Brand });
});
// @desc get list of brands
// @route GET api/v1/brands
// @access public
exports.getBrands = asyncHandler(async (req, res) => {
  // pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const Brand = await BrandModel.find().skip(skip).limit(limit);
  res.status(200).json({ results: Brand.length, data: Brand });
});
// @desc get specific Brand
// @route GET api/v1/brands/:id
// @access public
exports.getSpecificBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});
// @desc update specific brand
// @route PUT api/v1/brands/:id
// @access private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});
// @desc delete brand
// @route DELETE api/v1/brands/:id
// @access private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(204).send();
});
