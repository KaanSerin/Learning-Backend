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

// When a quote is added/removed update the number of reviews for the reviews author
QuoteSchema.statics.setNumberOfReviews = async function (authorId) {
  console.log("ello");
  const obj = await this.aggregate([
    { $match: { author: authorId } },
    // Just put _id for the grouping everytime
    { $group: { _id: "$author", count: { $sum: 1 } } },
  ]);

  const count = obj[0].count;

  await this.model("Author").findByIdAndUpdate(authorId, {
    numberOfQuotes: count,
  });
};

QuoteSchema.post("save", async function (next) {
  await this.constructor.setNumberOfReviews(this.author);
});

// Make this work thanks...
QuoteSchema.post("remove", async function (next) {
  await this.constructor.setNumberOfReviews(this.author);
});

const Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;
