const nodemailer = require("nodemailer");
require('dotenv').config();

const createTransporter = () => {
  if (process.env.EMAIL_ID && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.mail = async (req, res) => {
  try {
    const { senderEmail, senderName, recipientEmail, subject, html, resData } =
      req.body.mail;
    let transporter = createTransporter();
    const fromUser = process.env.EMAIL_ID || process.env.SMTP_USER;

    // Send mail
    let info;
    try {
      info = await transporter.sendMail({
        from: `"KheloIndore" <${fromUser}>`,
        to: recipientEmail,
        subject: subject,
        html: html,
      });
    } catch (mailErr) {
      console.error("Mail send error:", mailErr.message || mailErr);
    }

    return res.status(200).json({
      success: true,
      message: resData.message,
      ...(resData.token && { token: resData.token }),
      ...(resData.deliveryChannels && { deliveryChannels: resData.deliveryChannels }),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Mailer",
      error: err.message,
    });
  }
};

exports.sendMailHelper = async (to, subject, html) => {
  try {
    let transporter = createTransporter();
    const fromUser = process.env.EMAIL_ID || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"KheloIndore" <${fromUser}>`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error("Error sending email in helper:", err.message || err);
  }
};
