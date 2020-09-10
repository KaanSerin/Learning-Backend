const express = require("express");
const {
  getAuthors,
  addAuthor,
  getAuthor,
  deleteAuthor,
  updateAuthor,
} = require("../controllers/authors");

const router = express.Router();

router.route("/").get(getAuthors).post(addAuthor);

router.route("/:id").get(getAuthor).delete(deleteAuthor).put(updateAuthor);

module.exports = router;
