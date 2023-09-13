const express = require("express");
const router = express.Router();
const { getCategories } = require("../Controllers/categoryController");

router.get("/", getCategories);

module.exports = router;
