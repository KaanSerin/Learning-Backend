const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of the author"],
  },
  slug: String,
  about: {
    type: String,
    required: [true, "Enter a few words about the author"],
  },
  alive: Boolean,
});

module.exports = mongoose.model("Author", AuthorSchema);
