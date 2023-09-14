const CategoryModel = require("../Models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
// @desc create category
// @route POST api/v1/categories
// @access private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const category = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({ data: category });
});
// @desc get list of categories
// @route GET api/v1/categories
// @access public
exports.getCategory = asyncHandler(async (req, res) => {
  // pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, data: categories });
});
// @desc get specific category
// @route GET api/v1/categories/:id
// @access public
exports.getSpecificCategory = asyncHandler(async (req, res) => {
  // pagination
  const { id } = req.params;

  const category = await CategoryModel.findById(id);
  if (!category) {
    res.status(404).json({ msg: `No category for this id ${id}` });
  }
  res.status(200).json({data: category})
});
