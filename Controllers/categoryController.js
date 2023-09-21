const CategoryModel = require("../Models/categoryModel");
const factory = require("./handlersFactory");

// @desc create category
// @route POST api/v1/categories
// @access private
exports.createCategory = factory.create(CategoryModel);
// @desc get list of categories
// @route GET api/v1/categories
// @access public
exports.getCategory = factory.getAll(CategoryModel)
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
