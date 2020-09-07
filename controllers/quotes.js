// @desc Get all Quotes
// @route /api/v1/quotes
// @access Public
exports.getAllQuotes = (req, res, next) => {
  res.send("Get All Quotes");
};

// @desc Get quote by id
// @route /api/v1/quotes/:id
// @access Public
exports.getQuoteById = (req, res, next) => {
  res.send("Get Quote By Id");
};
