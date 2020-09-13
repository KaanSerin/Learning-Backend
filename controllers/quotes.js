const asyncHandler = require("express-async-handler");
const QuoteModel = require("../models/Quote");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc    Get all quotes
 * @route   GET /api/v1/quotes/
 * @access  Public
 */
exports.getQuotes = asyncHandler(async (req, res, next) => {
  const quotes = await QuoteModel.find().populate("author", "name about");
  if (!quotes) {
    return next(new ErrorResponse(`No quotes found.`, 404));
  }

  return res.status(200).json({
    success: true,
    count: quotes.length,
    data: quotes,
  });
});

/**
 * @desc    Get a quote by id
 * @route   GET /api/v1/quotes/:id
 * @access  Public
 */
exports.getQuote = asyncHandler(async (req, res, next) => {
  const quote = await QuoteModel.findById(req.params.id).populate(
    "author",
    "name about"
  );

  if (!quote) {
    return next(
      new ErrorResponse(`No quote with id ${req.params.id} found.`, 404)
    );
  }
  return res.status(200).json({ success: false, data: quote });
});

/**
 * @desc    Update a quote by id
 * @route   PUT /api/v1/quotes/:id
 * @access  Private
 */
exports.updateQuote = asyncHandler(async (req, res, next) => {
  const quote = await QuoteModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!quote) {
    return next(
      new ErrorResponse(`No quote with id ${req.params.id} found.`, 404)
    );
  }

  return res.status(200).json({ success: true, data: quote });
});

/**
 * @desc    Create a quote by id
 * @route   POST /api/v1/quotes/
 * @access  Private
 */
exports.createQuote = asyncHandler(async (req, res, next) => {
  const quote = await QuoteModel.create(req.body);
  res.status(201).json({ success: true, data: quote });
});

/**
 * @desc    Delete an quote by id
 * @route   DELETE /api/v1/quotes/:id
 * @access  Private
 */
exports.deleteQuote = asyncHandler(async (req, res, next) => {
  const quote = await QuoteModel.findByIdAndDelete(req.params.id);

  if (!quote) {
    return next(
      new ErrorResponse(`No quote with id ${req.params.id} found.`, 404)
    );
  }

  res.status(200).json({ success: true, data: quote });
});
