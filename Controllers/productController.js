const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../Models/productModel");
const ApiError = require("../Utils/apiError");

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
  // 1) Filtering
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const queryStringObj = { ...req.query };
  const excludedFields = ["page", "fields", "limit", "sort"];
  excludedFields.forEach((field) => delete queryStringObj[field]);
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  //
  // 2) Pagination

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 30;
  const skip = (page - 1) * limit;

  // Building query
  let mongooseQuery = productModel
    .find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });
  // 3) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createAt");
  }
  // 4) Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-_v");
  }
  //  5) searching
  if (req.query.keyword) {
    const query = {};
    query.$or = [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
    ];
    mongooseQuery = mongooseQuery.find(query);
  }
  // exccute query
  const products = await mongooseQuery;
  res.status(200).json({ results: products.length, data: products });
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
