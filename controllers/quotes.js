// @desc Get all Quotes
// @route GET /api/v1/quotes

const QuoteModel = require("../models/quote");

// @access Public
exports.getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await QuoteModel.find();
    res.status(200).json({ success: true, data: quotes });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

// @desc Get quote by id
// @route GET /api/v1/quotes/:id
// @access Public
exports.getQuoteById = (req, res, next) => {
  res.send("Get Quote By Id");
};

// @desc Create A Quote
// @route POST /api/v1/quotes
// @access Public
exports.createQuote = async (req, res, next) => {
  try {
    const quote = await QuoteModel.create(req.body);
    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};
