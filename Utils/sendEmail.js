// package nodemailer
// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1- create transporter service that will send email like gmail, mailgun, mailtrap, mailgrid
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false will be 587
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2- define email options like from, to subject, content
  const mailOptions = {
    from: "Amazone",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3- send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
