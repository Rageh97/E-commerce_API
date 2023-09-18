const express = require("express");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../Utils/Validators/productValidator");
const {
  createProduct,
  getProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getSpecificProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
