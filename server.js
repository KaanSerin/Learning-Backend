const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");

const quotes = require("./routes/quotes");
const authors = require("./routes/authors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Loading environment variables
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 6000;

const app = express();

connectDB();

// Body Parser
app.use(express.json());

// Routes
app.use("/api/v1/quotes", quotes);
app.use("/api/v1/authors", authors);

// Middleware. This has to be the last .use() method for the app
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
      .underline
  )
);
