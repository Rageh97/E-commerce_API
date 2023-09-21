const productModel = require("../Models/productModel");
const factory = require("./handlersFactory");
// @desc create product
// @route POST api/v1/products
// @access private
exports.createProduct = factory.create(productModel);
// @desc get list of products
// @route GET api/v1/products
// @access public
exports.getProducts = factory.getAll(productModel,"Products")

// @desc get specific product
// @route GET api/v1/products/:id
// @access public
exports.getSpecificProduct = factory.create(productModel);
// @desc update product
// @route PUT api/v1/products/:id
// @access private
exports.updateProduct = factory.update(productModel);
// @desc delete product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = factory.delete(productModel);
