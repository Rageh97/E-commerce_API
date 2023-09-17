const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 30 })
    .withMessage("Too long Subcategory name"),
  check("category").isEmpty().withMessage("subcategory must be belong to category").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Inavalid SubCategory Id"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Inavalid SubCategory Id"),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Inavalid SubCategory Id"),
  validatorMiddleware,
];
