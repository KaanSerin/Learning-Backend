const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  password: {
    type: String,
    required: [true, "Please enter a password."],
    select: false,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  console.log("Hashed password");
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});

UserSchema.pre("update", async function () {
  console.log("ello");

  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});

UserSchema.methods.getSignedJwtToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
};

// UserSchema.methods.updatePassword = async function (password) {
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);
//   this.password = hash;
//   return hash;
// };

// Get Reset Password Token and save it decrypted using node crypto
UserSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  console.log(`token: ${token} | encrypted token: ${encryptedToken}`);

  this.resetPasswordToken = encryptedToken;
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return token;
};

module.exports = mongoose.model("User", UserSchema);
