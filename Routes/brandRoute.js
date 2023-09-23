const express = require("express");

const router = express.Router();

const {
  getSpecificBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  resizeImage,
  uploadBrandImage
} = require("../Controllers/brandController");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../Utils/Validators/brandValidator");

router.route("/").get(getBrands).post(uploadBrandImage, resizeImage,createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getSpecificBrand)
  .put(uploadBrandImage,resizeImage,updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
