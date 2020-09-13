const asyncHandler = require("express-async-handler");
const AuthorModel = require("../models/Author");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc    Get all authors
 * @route   GET /api/v1/authors
 * @access   Public
 */
exports.getAuthors = asyncHandler(async (req, res, next) => {
  const authors = await AuthorModel.find();

  if (authors.length === 0) {
    return next(new ErrorResponse("No authors found.", 400));
  }

  return res
    .status(200)
    .json({ success: true, count: authors.length, data: authors });
});

/**
 * @desc    Get an author by id
 * @route   GET /api/v1/authors/:id
 * @access  Private
 */
exports.getAuthor = asyncHandler(async (req, res, next) => {
  const author = await AuthorModel.findById(req.params.id);

  if (!author) {
    return next(
      new ErrorResponse(`No author found with id ${req.params.id} found.`, 404)
    );
  }

  return res.status(200).json({ success: true, data: author });
});

/**
 * @desc    Delete an author by id
 * @route   DELETE /api/v1/authors/:id
 * @access  Private
 */
exports.deleteAuthor = asyncHandler(async (req, res, next) => {
  const author = await AuthorModel.findByIdAndDelete(req.params.id);

  if (!author) {
    return next(
      new ErrorResponse(`No author found with id ${req.params.id} found.`, 404)
    );
  }

  return res.status(401).json({ success: true, data: author });
});

/**
 * @desc    Update an author by id
 * @route   PUT /api/v1/authors/:id
 * @access  Private
 */
exports.updateAuthor = asyncHandler(async (req, res, next) => {
  const author = await AuthorModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!author) {
    return next(
      new ErrorResponse(`No author found with id ${req.params.id} found.`, 404)
    );
  }

  return res.status(200).json({ success: true, data: author });
});

/**
 * @desc    Add an author
 * @route   POST /api/v1/authors
 * @access  Private
 */
exports.addAuthor = asyncHandler(async (req, res, next) => {
  const author = await AuthorModel.create(req.body);
  return res.status(201).json({ success: true, data: author });
});
