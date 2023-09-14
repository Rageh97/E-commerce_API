const express = require("express");
const router = express.Router();
const {
  getCategory,
  createCategory,
  getSpecificCategory,
  updateCategory,
  deleteCategory
} = require("../Controllers/categoryController");

router.route("/").get(getCategory).post(createCategory);
router.route("/:id").get(getSpecificCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;
