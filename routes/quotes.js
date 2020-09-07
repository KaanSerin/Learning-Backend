const express = require("express");
const {
  getAllQuotes,
  getQuoteById,
  createQuote,
} = require("../controllers/quotes");

const router = express.Router();

router.route("/").get(getAllQuotes).post(createQuote);

router.route("/:id").get(getQuoteById);

module.exports = router;
