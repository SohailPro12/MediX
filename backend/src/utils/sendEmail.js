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

    });

    console.log("📧 Email envoyé !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
};

module.exports = sendEmail;
