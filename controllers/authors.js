const AuthorModel = require("../models/Author");

/**
 * @desc    Get all authors
 * @route   GET /api/v1/authors
 * @access   Public
 */
exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await AuthorModel.find();

    if (authors.length === 0) {
      return res.status(400).json({ success: false, msg: "No authors found" });
    }

    return res
      .status(200)
      .json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

/**
 * @desc    Get an author by id
 * @route   GET /api/v1/authors/:id
 * @access  Private
 */
exports.getAuthor = async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        msg: `Author not found with id ${req.params.id}`,
      });
    }

    return res.status(200).json({ success: true, data: author });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

/**
 * @desc    Delete an author by id
 * @route   DELETE /api/v1/authors/:id
 * @access  Private
 */
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        msg: `Author not found with id ${req.params.id}`,
      });
    }

    return res.status(401).json({ success: true, data: author });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

/**
 * @desc    Update an author by id
 * @route   PUT /api/v1/authors/:id
 * @access  Private
 */
exports.updateAuthor = async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!author) {
      return res.status(404).json({
        success: false,
        msg: `Author not found with id ${req.params.id}`,
      });
    }

    return res.status(200).json({ success: true, data: author });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

/**
 * @desc    Add an author
 * @route   POST /api/v1/authors
 * @access  Private
 */
exports.addAuthor = async (req, res, next) => {
  try {
    const author = await AuthorModel.create(req.body);
    return res.status(201).json({ success: true, data: author });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
