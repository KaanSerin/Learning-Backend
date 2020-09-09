const express = require("express");
const {
  getAuthors,
  addAuthor,
  getAuthor,
  deleteAuthor,
} = require("../controllers/authors");

const router = express.Router();

router.route("/").get(getAuthors).post(addAuthor);

router.route("/:id").get(getAuthor).delete(deleteAuthor);

module.exports = router;
