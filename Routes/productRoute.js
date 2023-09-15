const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");
router.route("/").post(createProduct).get(getProducts);
router
  .route("/:id")
  .get(getSpecificProduct)
  .put(updateProduct)
  .delete(deleteProduct);
