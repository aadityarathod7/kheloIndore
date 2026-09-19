const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_ID, pass: process.env.EMAIL_PASSWORD },
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

exports.sendPasswordResetLinkEmail = ({ recipientEmail, subject, html }) => {
  const sender = process.env.EMAIL_SERVICE === "gmail" ? process.env.EMAIL_ID : process.env.SMTP_USER;
  return createTransporter().sendMail({
    from: `"KheloIndore" <${sender}>`,
    to: recipientEmail,
    subject,
    html,
  });
};
