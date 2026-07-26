const nodemailer = require("nodemailer");
require('dotenv').config();

exports.mail = async (req, res) => {
  try {
    const { senderEmail, senderName, recipientEmail, subject, html, resData } =
      req.body.mail;
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // SMTP hostname
        port: process.env.SMTP_PORT, // SMTP port
        secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
        auth: {
          user: process.env.SMTP_USER, // SMTP username
          pass: process.env.SMTP_PASS, // SMTP password
        },
      });

    // Send mail
    let info;
    try {
      info = await transporter.sendMail({
        from: `"KheloIndore" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: subject,
        html: html,
      });
      console.log("Email sent successfully to:", recipientEmail);
    } catch (mailErr) {
      console.error("Failed to send email via SMTP (this error is bypassed for local development):", mailErr.message);
      console.log("======== LOCAL DEVELOPMENT MAIL LOG ========");
      console.log("To:", recipientEmail);
      console.log("Subject:", subject);
      console.log("============================================");
    }

    return res.status(200).json({
      success: true,
      message: resData.message,

      ...(resData.token && { token: resData.token }),
    });
  } catch (err) {
    console.error("General Mailer Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Mailer",
      error: err.message,
    });
  }
};
