const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const CategoryModel = require("../../Models/categoryModel");
const SubCategoryModel = require("../../Models/subCategoryModel");
const subCategoryModel = require("../../Models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title required")
    .isLength({ min: 2 })
    .withMessage("Too short Product name"),
  check("description")
    .notEmpty()
    .withMessage("Product description required")
    .isLength({ max: 2000 })
    .withMessage("Too long Product description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long Product price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price after discount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be an array of strings"),
  check("imageCover").notEmpty().withMessage("product image cover required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be an array of strings"),

  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array of strings"),
  check("category")
    .notEmpty()
    .withMessage("product must belong to category")
    .isMongoId()
    .withMessage("Invalid Id format")
    .custom((id) =>
      CategoryModel.findById(id).then((category) => {
        if (!category) {
          return Promise.reject(new Error("No category for this id"));
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id format")
    .custom((ids) =>
      SubCategoryModel.find({ _id: { $exists: true, $in: ids } }).then(
        (result) => {
          if (result.length < 1 || result.length !== ids.length) {
            return Promise.reject(new Error("Invalid subcategories id's"));
          }
        }
      )
    )
    .custom((val, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })

        .then((subcategories) => {
          const subcategoriesIdInDb = [];
          subcategories.forEach((subcategory) => {
            subcategoriesIdInDb.push(subcategory._id.toString());
          });
          if (!val.every((v) => subcategoriesIdInDb.includes(v))) {
            return Promise.reject(new Error("subcategories not belong to category"));
          }
        })
    ),
  check("brand").optional().isMongoId().withMessage("Invalid Id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number"),
  validatorMiddleware,
];
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Inavalid Product Id"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Inavalid Product Id"),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Inavalid Product Id"),
  validatorMiddleware,
];
