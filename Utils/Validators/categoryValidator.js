const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 30 })
    .withMessage("Too long category name"),
  validatorMiddleware,
];
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Inavalid Category Id"),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Inavalid Category Id"),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Inavalid Category Id"),
  validatorMiddleware,
];
