const cookieParser = require("cookie-parser");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc    Protecting routes that need authentication
 */
exports.protect = expressAsyncHandler(async (req, res, next) => {
  // Check headers
  const { authorization } = req.headers;
  const { AUTH_TOKEN } = cookieParser.JSONCookies(req.cookies);

  let token;

  if (authorization) {
    if (!authorization.startsWith("Bearer")) {
      return next(new ErrorResponse("User Unauthorized.", 401));
    } else {
      token = authorization.split(" ")[1];
    }
  } else if (AUTH_TOKEN) {
    if (AUTH_TOKEN === "none") {
      return next(new ErrorResponse("User Unauthorized.", 401));
    } else {
      token = AUTH_TOKEN;
    }
  }

  // const token = authorization.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("User Unauthorized.", 401));
  }

  const id = jwt.decode(token).id;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorResponse("User Unauthorized.", 401));
  }

  req.user = user;

  next();
});

/**
 * @desc    Protecting routes that need authentication
 */
exports.authorize = (...roles) => (req, res, next) => {
  if (roles.length === 0) next();

  const role = req.user.role;

  if (!roles.includes(role)) {
    return next(new ErrorResponse("User Unauthorized.", 401));
  }

  next();
};
