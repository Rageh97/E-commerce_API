const express = require("express");
const router = express.Router();
const {
  getCategory,
  createCategory,
  getSpecificCategory,
} = require("../Controllers/categoryController");

router.route("/").get(getCategory).post(createCategory);
router.route("/:id").get(getSpecificCategory);

module.exports = router;
