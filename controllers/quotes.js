const QuoteModel = require("../models/Quote");

/**
 * @desc    Get all quotes
 * @route   GET /api/v1/quotes/
 * @access  Public
 */
exports.getQuotes = async (req, res, next) => {
  try {
    const quotes = await QuoteModel.find().populate("author", "name about");
    if (!quotes) {
      return res.status(400).json({ success: false, msg: "No quotes found" });
    }

    return res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc    Get a quote by id
 * @route   GET /api/v1/quotes/:id
 * @access  Public
 */
exports.getQuote = async (req, res, next) => {
  try {
    const quote = await QuoteModel.findById(req.params.id).populate(
      "author",
      "name about"
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        msg: `Quote with id ${req.params.id} not found.`,
      });
    }

    // await quote
    //   .populate({
    //     path: "author",
    //     model: "Author",
    //     select: "name about",
    //    })
    //   .execPopulate();

    return res.status(200).json({ success: false, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc    Update a quote by id
 * @route   PUT /api/v1/quotes/:id
 * @access  Private
 */
exports.updateQuote = async (req, res, next) => {
  try {
    const quote = await QuoteModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        msg: `Quote not found with id ${req.params.id}`,
      });
    }

    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

/**
 * @desc    Create a quote by id
 * @route   POST /api/v1/quotes/
 * @access  Private
 */
exports.createQuote = async (req, res, next) => {
  try {
    const quote = await QuoteModel.create(req.body);
    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

/**
 * @desc    Delete an quote by id
 * @route   DELETE /api/v1/quotes/:id
 * @access  Private
 */
exports.deleteQuote = async (req, res, next) => {
  try {
    const quote = await QuoteModel.findByIdAndDelete(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        msg: `Quote with id ${req.params.id} not found.`,
      });
    }

    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};
