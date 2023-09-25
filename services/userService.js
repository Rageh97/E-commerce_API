// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
  // save image into database
  req.body.profileImg = fileName;
  next();
});
// @desc create Users
// @route POST api/v1/Users
// @access private
exports.createUser = factory.create(User);
// @desc get list of Users
// @route GET api/v1/Users
// @access private
exports.getUsers = factory.getAll(User);
// @desc get specific User
// @route GET api/v1/Users/:id
// @access private
exports.getSpecificUser = factory.getOne(User);
// @desc update specific User
// @route PUT api/v1/Users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// this route for change password
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  if (!document) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// @desc delete User
// @route DELETE api/v1/Users/:id
// @access private
exports.deleteUser = factory.delete(User);
