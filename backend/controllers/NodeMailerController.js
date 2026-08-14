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
      
    } catch (mailErr) {
      
      
      
      
      
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
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"KheloIndore" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error("Error sending email in helper:", err);
  }
};
