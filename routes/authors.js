const express = require("express");
const {
  getAuthors,
  addAuthor,
  getAuthor,
  deleteAuthor,
  updateAuthor,
} = require("../controllers/authors");
const advancedResults = require("../middleware/advancedResults");
const Author = require("../models/Author");

const router = express.Router();

router.route("/").get(advancedResults(Author, ""), getAuthors).post(addAuthor);

router.route("/:id").get(getAuthor).delete(deleteAuthor).put(updateAuthor);

module.exports = router;
