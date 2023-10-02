const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

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
  const token = createToken(user._id);
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
  const token = createToken(user._id);
  // Delete password from response
  delete user._doc.password;
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

// @desc Authorization (user permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //  1) access roles
    //  2) access registered user (req.user.role)
    if (!roles.includes(req.user.roles)) {
      return next(new ApiError("You are not allowed to access this page", 403));
    }
  });

// @desc Forgot password
// @route POST api/v1/auth/forgotPassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404)
    );
  }
  // 1) if user exist, generate reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  // 3) send the reset code to via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
