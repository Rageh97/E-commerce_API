const express = require("express");

const router = express.Router();

const {
  getSpecificBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../Controllers/brandController");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../Utils/Validators/brandValidator");

router.route("/").get(getBrands).post(createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getSpecificBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
