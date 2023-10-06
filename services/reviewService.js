const Review = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.params.user._id;
  next();
};

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc create reviews
// @route POST api/v1/reviews
// @access private/protect/user
exports.createReview = factory.create(Review);
// @desc get list of reviews
// @route GET api/v1/reviews
// @access public
exports.getReviews = factory.getAll(Review);
// @desc get specific Review
// @route GET api/v1/reviews/:id
// @access public
exports.getSpecificReview = factory.getOne(Review);
// @desc update specific Review
// @route PUT api/v1/reviews/:id
// @access private/protect/user
exports.updateReview = factory.update(Review);
// @desc delete Review
// @route DELETE api/v1/reviews/:id
// @access private/protect/user&admin&manger
exports.deleteReview = factory.delete(Review);
