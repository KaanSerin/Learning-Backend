// Let's load all the data from a json file to our database
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const QuoteModel = require("./models/quote");
const AuthorModel = require("./models/author");
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

const deleteAll = async () => {
  await QuoteModel.deleteMany();
  await AuthorModel.deleteMany();
  console.log("Deleted Quotes...".underline.bold.red);
  process.exit();
};

const addAll = async () => {
  await AuthorModel.create(
    JSON.parse(
      fs.readFileSync(path.join(__dirname, "config", "authors.json"), {
        encoding: "utf-8",
      })
    )
  );

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
  deleteAll();
} else if (process.argv[2] === "-i") {
  addAll();
} else {
  console.log(
    "No arguments. -i to load all data. -D to delete all database documents"
      .blue.bold.underline
  );
  process.exit();
}
