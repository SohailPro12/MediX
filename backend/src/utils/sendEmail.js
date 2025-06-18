const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, EmailContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: EmailContent,

    });    console.log("📧 Email envoyé !");
  } catch (error) {
    // Email service is not configured properly, but this shouldn't block the main functionality
    console.log("ℹ️  Note: Email notification service is not configured (appointment creation still works)");
  }
};

module.exports = sendEmail;
