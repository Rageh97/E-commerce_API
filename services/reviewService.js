const Review = require("../models/reviewModel");
const factory = require("./handlersFactory");

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
