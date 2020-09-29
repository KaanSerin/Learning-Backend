const express = require("express");
const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.get("/logout", protect, logout);
router.route("/me").get(protect, me);
router.route("/updatepassword").put(protect, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);
module.exports = router;
