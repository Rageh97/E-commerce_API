  const SubCategory = require("../Models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc create subcategory
// @route POST api/v1/subcategories
// @access private
exports.createSubCategory = factory.create(SubCategory);
// nested routes
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// @desc get list of subcategories
// @route GET api/v1/subcategories
// @access public
exports.getSubCategories = factory.getAll(SubCategory);
// @desc get specific subcategory
// @route GET api/v1/subcategories/:id
// @access public
exports.getSpecificSubCategory = factory.create(SubCategory);
// @desc update specific subcategory
// @route PUT api/v1/subcategories/:id
// @access private
exports.updateSubCategory = factory.update(SubCategory);
// @desc delete subcategory
// @route DELETE api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = factory.delete(SubCategory);
