const express = require("express");
const {
  getQuotes,
  createQuote,
  getQuote,
  deleteQuote,
  updateQuote,
} = require("../controllers/quotes");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const Quote = require("../models/Quote");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Quote, "author"), getQuotes)
  .post(protect, authorize("editor"), createQuote);

router
  .route("/:id")
  .get(getQuote)
  .delete(protect, authorize("editor"), deleteQuote)
  .put(protect, authorize("editor"), updateQuote);

module.exports = router;
