const express = require("express");
const router = express.Router();

const {
  getCategory,
  createCategory,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../Utils/Validators/categoryValidator");

router
  .route("/")
  .get(getCategory)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getSpecificCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
