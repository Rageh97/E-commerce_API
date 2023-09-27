const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc sign up
// @route POST api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1) create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //  2) generatw wt
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(201).json({data:user, token})
});
