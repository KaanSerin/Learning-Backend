const mongoose = require("mongoose");
const slugify = require("slugify");

const QuoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: false,
  },
  authorSlug: String,
});

QuoteSchema.pre("save", function (next) {
  this.authorSlug = slugify(this.author, {
    lower: true,
    strict: true,
    replacement: "_",
  });
  return next();
});

const QuoteModel = mongoose.model("Quote", QuoteSchema);

module.exports = QuoteModel;
