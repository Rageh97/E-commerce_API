// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../models/userModel");
const factory = require("./handlersFactory");

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");
// image processing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
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
exports.createUser = factory.create(UserModel);
// @desc get list of Users
// @route GET api/v1/Users
// @access private
exports.getUsers = factory.getAll(UserModel);
// @desc get specific User
// @route GET api/v1/Users/:id
// @access private
exports.getSpecificUser = factory.getOne(UserModel);
// @desc update specific User
// @route PUT api/v1/Users/:id
// @access private
exports.updateUser = factory.update(UserModel);
// @desc delete User
// @route DELETE api/v1/Users/:id
// @access private
exports.deleteUser = factory.delete(UserModel);
