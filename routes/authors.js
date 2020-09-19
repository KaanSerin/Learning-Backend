const express = require("express");
const {
  getAuthors,
  addAuthor,
  getAuthor,
  deleteAuthor,
  updateAuthor,
  uploadAuthorImage,
} = require("../controllers/authors");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const Author = require("../models/Author");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Author, ""), getAuthors)
  .post(protect, authorize("editor"), addAuthor);

router
  .route("/:id")
  .get(getAuthor)
  .delete(protect, authorize("editor"), deleteAuthor)
  .put(protect, authorize("editor"), updateAuthor);

router
  .route("/:id/image")
  .post(protect, authorize("editor"), uploadAuthorImage);

module.exports = router;
