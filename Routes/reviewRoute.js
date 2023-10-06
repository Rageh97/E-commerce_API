const express = require("express");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  getSpecifiReview,

  updatReview,
  deletReview,
  createReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router({mergeParams:true});

router
  .route("/")
  .get(createFilterObj,getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getSpecifiReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updatReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manager"),
    deleteReviewValidator,
    deletReview
  );

module.exports = router;
