const productModel = require("../Models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
// @desc create product
// @route POST api/v1/products
// @access private
exports.createProduct = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const product = await productModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: product });
});
// @desc get list of products
// @route GET api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await productModel.find().skip(skip).limit(limit);
  res.status(200).json({ results: products.length, data: products });
});
// @desc get specific product
// @route GET api/v1/products/:id
// @access public
exports.getSpecificProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    // res.status(404).json({ msg: "Product not found" });
   return next(new ApiError(`Product not found for this id ${id}`, 404));
  }
  response.status(200).json({ data: product });
});
// @desc update product
// @route PUT api/v1/products/:id
// @access private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const product = await productModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!product) {
    // res.status(404).json({ msg: `No product for this id ${id}` });
    return next(new ApiError(`Product not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});
// @desc delete product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    // res.status(404).json({ msg: `No product for this id ${id}` });
    return next(new ApiError(`Product not found for this id ${id}`, 404));
  }
  res.status(204).send();
});
