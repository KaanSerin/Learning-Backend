const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");

/**
 * @desc    Register a user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = expressAsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getSignedJwtToken();

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

  res.status(200).json({ success: true, token });
});

/**
 * @desc    Get User Information
 * @route   GET /api/v1/auth/me
 * @access  Private
 */

// Todo: Use the jwt from req.header , parse it to the id, authenticate the user, and return some information about said user
//      If user not found throw unauthorized error.
exports.login = expressAsyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, token });
});
