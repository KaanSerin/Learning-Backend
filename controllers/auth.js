const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

/**
 * @desc    Register a user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = expressAsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getSignedJwtToken();

  res.cookie("AUTH_TOKEN", token);

  res.status(200).json({ success: true, token });
});

/**
 * @desc    Login User
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please enter an email and a password", 400));
  }

  // Check for the user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid username and / or password", 400));
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return next(new ErrorResponse("Invalid username and / or password", 400));
  }

  const token = user.getSignedJwtToken();

  res.cookie("AUTH_TOKEN", token);

  res.status(200).json({ success: true, token });
});

/**
 * @desc    Get information about the user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.me = expressAsyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});

/**
 * @desc    Forgot Password. Get a reset password token.
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Private
 */
exports.forgotPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const token = user.getResetPasswordToken();

  // DECODE THE TOKEN ABOVE WITH JSON WEB TOKENS AND USE THAT

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, token });
});

/**
 * @desc    Reset Password.
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Private
 */
exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  // THE TOKEN WILL A JSONWEBTOKEN AND WILL NEED TO BE DECODED
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse("Invalid route", 400));
  }

  const { password } = req.body;

  if (!password) {
    return next(new ErrorResponse("Please enter a new password", 400));
  }

  console.log(token, password);

  const encrypedPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  let user = await User.findOne({ resetPasswordToken: encrypedPasswordToken });

  if (!user) {
    return next(new ErrorResponse("User unauthorized", 401));
  }

  if (Date.now() > user.resetPasswordExpire) {
    return next(new ErrorResponse("Reset token expired", 401));
  }

  user.password = password;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});
