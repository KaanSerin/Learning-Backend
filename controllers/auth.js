const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const utils = require("../utils/utils");
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
 * @desc    Logout User
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
exports.logout = expressAsyncHandler(async (req, res, next) => {
  res.cookie("AUTH_TOKEN", "none", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({ success: true, data: {} });
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
 * @desc    Update Password
 * @route   PUT /api/v1/auth/updatePassword
 * @access  Private
 */
exports.updatePassword = expressAsyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  console.log(req.user.email);

  if (!currentPassword || !newPassword) {
    return next(
      new ErrorResponse("Please provide a current and new password", 400)
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new ErrorResponse("Invalid password", 400));
  }

  user.password = newPassword;

  await user.save({ runValidators: true });

  res.status(200).json({ success: true, user });
});

/**
 * @desc    Forgot Password. Get a reset password token.
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Private
 */
exports.forgotPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse("No email provided", 400));
  }

  const user = await User.findOne({ email });

  const token = user.getResetPasswordToken();

  try {
    await utils.sendMail(
      `Go here pls: https://www.myapi.com/api/v1/auth/resetpassword/${token}`,
      email
    );
  } catch (error) {
    return next(new ErrorResponse("Email could not be sent", 500));
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, token: token });
});

/**
 * @desc    Reset Password.
 * @route   POST /api/v1/auth/resetpassword
 * @access  Private
 */

// Read this article:  https://medium.com/mesan-digital/tutorial-3b-how-to-add-password-reset-to-your-node-js-authentication-api-using-sendgrid-ada54c8c0d1f
exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  // THE TOKEN WILL NEED TO BE DECODED
  const { token } = req.params;

  if (!token) {
    return next(new ErrorResponse("Invalid route", 400));
  }

  const { password } = req.body;

  if (!password) {
    return next(new ErrorResponse("Please enter a new password", 400));
  }

  const encrypedPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken: encrypedPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 401));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});
