const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 30 })
    .withMessage("Too long Brand name"),
  validatorMiddleware,
];
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Inavalid Brand Id"),
  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Inavalid Brand Id"),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Inavalid Brand Id"),
  validatorMiddleware,
];
