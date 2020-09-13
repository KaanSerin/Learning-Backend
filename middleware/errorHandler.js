const ErrorResponse = require("../utils/errorResponse");

module.exports = errorHandler = (err, req, res, next) => {
  // Log for the user to see
  //   console.log(err);

  let error = { ...err };

  if (err.kind === "ObjectId") {
    error = new ErrorResponse("Please enter a valid id", 400);
  }

  if (err.name === "ValidationError") {
    let message = Object.keys(error.errors)
      .map((key) => error.errors[key].message)
      .join(" | ");
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, msg: error.message || err });
};
