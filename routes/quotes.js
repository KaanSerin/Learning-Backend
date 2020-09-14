const express = require("express");
const {
  getQuotes,
  createQuote,
  getQuote,
  deleteQuote,
  updateQuote,
} = require("../controllers/quotes");
const advancedResults = require("../middleware/advancedResults");
const Quote = require("../models/Quote");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Quote, "author"), getQuotes)
  .post(createQuote);

router.route("/:id").get(getQuote).delete(deleteQuote).put(updateQuote);

module.exports = router;
