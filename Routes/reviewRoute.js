const express = require("express");

// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");

const {
  getReviews,
  getSpecifiReview,

  updatReview,
  deletReview,
  createReview,
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router();

router.route("/").get(getReviews).post(
  authService.protect,
  authService.allowedTo("user"),

  createReview
);
router
  .route("/:id")
  .get(getSpecifiReview)
  .put(authService.protect, authService.allowedTo("user"), updatReview)
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manager"),

    deletReview
  );

module.exports = router;
