const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage(" Rating Value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 and 5"),
  check("user").isMongoId().withMessage("Inavalid Review Id"),
  check("product")
    .isMongoId()
    .withMessage("Inavalid Review Id")
    .custom((val, { req }) => {
      // check if user logged create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      );
    }),
  validatorMiddleware,
];
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Inavalid Review Id"),
  validatorMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Inavalid Review Id")
    .custom((val, { req }) =>
      // check review owner before updating
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Inavalid Review Id")
    .custom((val, { req }) => {
      // check review owner before deleting
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true
    }),
  validatorMiddleware,
];
