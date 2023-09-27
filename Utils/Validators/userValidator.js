const { check, body } = require("express-validator");
const slugify = require("slugify");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is incorrect");
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("password confirm required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone number only accepted Egypt numbers and saudi arabia"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Inavalid User Id"),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Inavalid User Id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone number only accepted Egypt numbers and saudi arabia"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter the new password ")
    .custom(async (password, { req }) => {
      // 1) verify the current password
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      // 1) verify password confirm
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Inavalid User Id"),
  validatorMiddleware,
];
