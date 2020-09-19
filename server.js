const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");
const path = require("path");
const quotes = require("./routes/quotes");
const authors = require("./routes/authors");
const auth = require("./routes/auth");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const moment = require("moment");

// Loading environment variables
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 6000;

const app = express();

connectDB();

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Body Parser
app.use(express.json());

app.use(
  cookieParser(process.env.COOKIES_SECRET, {
    signed: true,
    httpOnly: true,
    expires: moment().add(process.env.COOKIES_EXPIRE, "days"),
  })
);

app.use(
  fileUpload({
    limits: { fileSize: process.env.MAX_FILE_SIZE },
  })
);

// Routes
app.use("/api/v1/quotes", quotes);
app.use("/api/v1/authors", authors);
app.use("/api/v1/auth", auth);

// Middleware. This has to be the last .use() method for the app
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
      .underline
  )
);
