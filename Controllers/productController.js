const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../Models/productModel");
const ApiError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/apiFeatures");
// @desc create product
// @route POST api/v1/products
// @access private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res.status(201).json({ data: product });
});
// @desc get list of products
// @route GET api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res) => {
  const documentsCount = await productModel.countDocuments();
  // Building query
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .pagination(documentsCount)
    .sort()
    .filter()
    .search("Products")
    .limitFields();
  // exccute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;
  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

// @desc get specific product
// @route GET api/v1/products/:id
// @access public
exports.getSpecificProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate({ path: "category", select: "name" });
  if (!product) {
    // res.status(404).json({ msg: "Product not found" });
    return next(new ApiError(`Product not found for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});
// @desc update product
// @route PUT api/v1/products/:id
// @access private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
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
