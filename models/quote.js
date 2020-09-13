const mongoose = require("mongoose");
const slugify = require("slugify");

const QuoteSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: true,
    required: [true, "Please enter the quote."],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: [true, "Please enter the id of the author of the quote"],
  },

  language: {
    type: String,
    required: false,
  },
  authorSlug: String,
});

QuoteSchema.pre("save", async function (next) {
  const author = await this.model("Author").findById(this.author.toString());
  this.authorSlug = slugify(author.name, {
    lower: true,
    strict: true,
    replacement: "_",
  });
  return next();
});

const QuoteModel = mongoose.model("Quote", QuoteSchema);

module.exports = QuoteModel;
