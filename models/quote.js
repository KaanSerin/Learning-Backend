const mongoose = require("mongoose");

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
});

const QuoteModel = mongoose.model("Quote", QuoteSchema);

module.exports = QuoteModel;
