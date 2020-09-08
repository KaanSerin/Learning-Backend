// Let's load all the data from a json file to our database
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const QuoteModel = require("./models/quote");
const colors = require("colors");

mongoose.connect(
  "mongodb+srv://kaan123:kaan123@learningproject1.hpgus.mongodb.net/learningproject1?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const deleteAllQuotes = async () => {
  await QuoteModel.deleteMany();
  console.log("Deleted Quotes...".underline.bold.red);
  process.exit();
};

const addAllQuotes = async () => {
  await QuoteModel.create(
    JSON.parse(
      fs.readFileSync(path.join(__dirname, "config", "quotes.json"), {
        encoding: "utf-8",
      })
    )
  );
  console.log("Added Quotes...".underline.bold.green);
  process.exit();
};

if (process.argv[2] === "-D") {
  deleteAllQuotes();
} else if (process.argv[2] === "-i") {
  addAllQuotes();
} else {
  console.log(
    "No arguments. -i to load all data. -D to delete all database documents"
      .blue.bold.underline
  );
  process.exit();
}
