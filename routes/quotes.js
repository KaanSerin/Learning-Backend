const express = require("express");
const {
  getQuotes,
  createQuote,
  getQuote,
  deleteQuote,
} = require("../controllers/quotes");

const router = express.Router();

router.route("/").get(getQuotes).post(createQuote);

router.route("/:id").get(getQuote).delete(deleteQuote);

module.exports = router;
