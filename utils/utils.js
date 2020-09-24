const nodemailer = require("nodemailer");

exports.sendMail = async (message, to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Quotes And Authors <${process.env.NODEMAILER_EMAIL}>`,
    to,
    subject: "Reset Password",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
  });
};
