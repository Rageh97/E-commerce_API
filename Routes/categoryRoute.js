const express = require("express");

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
const subcategoryRoute = require("./subCategoryRoute");

const router = express.Router();
router.use("/:categoryId/subcategories", subcategoryRoute);
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
