const asyncHandler = require("express-async-handler");
const Author = require("../models/Author");
const AuthorModel = require("../models/Author");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Get all authors
 * @route   GET /api/v1/authors
 * @access   Public
 */
exports.getAuthors = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
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

/**
 * @desc    Add an author image
 * @route   POST /api/v1/authors/:id/image
 * @access  Private
 */
exports.uploadAuthorImage = asyncHandler(async (req, res, next) => {
  let file = Object.values(req.files)[0];

  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(new ErrorResponse("Image file must be smalled then 4MB!", 400));
  }
  if (!/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name)) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }

  let filePath = path.join("public/images/authors", `${req.params.id}.jpeg`);

  console.log();

  if (fs.existsSync(filePath) && req.headers.override !== "true") {
    return next(new ErrorResponse("Author image already exists", 400));
  }

  await file.mv(filePath);

  res.status(200).json({ sucess: true, msg: "Author image set!" });
});
