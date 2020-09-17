const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name."],
    minlength: [6, "Your name must be longer then 6 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    index: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    required: [true, "Please enter your role."],
    enum: ["user", "editor"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});

module.exports = mongoose.model("User", UserSchema);
