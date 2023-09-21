const BrandModel = require("../Models/brandModel");

const factory = require("./handlersFactory");
// @desc create Brands
// @route POST api/v1/brands
// @access private
exports.createBrand = factory.create(BrandModel);
// @desc get list of brands
// @route GET api/v1/brands
// @access public
exports.getBrands = factory.getAll(BrandModel);
// @desc get specific Brand
// @route GET api/v1/brands/:id
// @access public
exports.getSpecificBrand = factory.getOne(BrandModel);
// @desc update specific brand
// @route PUT api/v1/brands/:id
// @access private
exports.updateBrand = factory.update(BrandModel);
// @desc delete brand
// @route DELETE api/v1/brands/:id
// @access private
exports.deleteBrand = factory.delete(BrandModel);
