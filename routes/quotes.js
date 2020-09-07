const express = require("express");
const { getAllQuotes, getQuoteById } = require("../controllers/quotes");

const router = express.Router();

router.route("/").get(getAllQuotes);

router.route("/:id").get(getQuoteById);

module.exports = router;
