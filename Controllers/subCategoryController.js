const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategory = require("../Models/subCategoryModel");
const ApiError = require("../Utils/apiError");

exports.setCategoryIdToBody = (req, res, next) => {
  // nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc create subcategory
// @route POST api/v1/subcategories
// @access private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});
// @desc get list of subcategories
// @route GET api/v1/subcategories
// @access public
exports.getSubCategories = asyncHandler(async (req, res) => {
  // pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  let filterObj = {};
  if (req.params.categoryId) filterObj = { categor: req.params.categoryId };
  const subCategories = await SubCategory.find(filterObj)
    .skip(skip)
    .limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res.status(200).json({ results: subCategories.length, data: subCategories });
});
// @desc get specific subcategory
// @route GET api/v1/subcategories/:id
// @access public
exports.getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});
// @desc update specific subcategory
// @route PUT api/v1/subcategories/:id
// @access private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});
// @desc delete subcategory
// @route DELETE api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(204).send();
});
