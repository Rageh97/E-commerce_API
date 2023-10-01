const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

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
  res.status(201).json({ data: user, token });
});
// @desc sign up
// @route POST api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if the passw and email in the body(validations)
  // 2) check if the user exist and password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3) generate the token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  // 4) send the response to the client
  res.status(200).json({ data: user, token });
});

// @desc make sure the user is authenticated
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist and if get it.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("you are not login , please login to access this page", 401)
    );
  }

  // 2) verify the token (No change or expires)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("The user does not exist", 401));
  }
  // 4) check if the user change his password after token created
  if (currentUser.passwordChangeAt) {
    const passwordChangeTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passwordChangeTimestamp > decoded.iat) {
      return next(new ApiError("user recently change his password", 401));
    }
  }
  req.user = currentUser;
  next();
});

// @desc
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //  1) access roles
    //  1) access registered user (req.user.role)
    if (!roles.includes(req.user.roles)) {
      return next(new ApiError("You are not allowed to access this page", 403));
    }
  });
