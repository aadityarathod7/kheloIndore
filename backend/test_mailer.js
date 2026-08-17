const nodemailer = require("./node_modules/nodemailer");
require("dotenv").config();

async function testGmail() {
  console.log("Testing Gmail transporter...");
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"KheloIndore Gmail" <${process.env.EMAIL_ID}>`,
      to: "swapinfotechindore@gmail.com",
      subject: "Test Gmail Mailer",
      html: "<h3>This is a test from Gmail transporter</h3>",
    });
    console.log("Gmail success:", info.messageId);
    return true;
  } catch (err) {
    console.error("Gmail failed:", err.message || err);
    return false;
  }
}

async function testHostinger() {
  console.log("Testing Hostinger SMTP transporter...");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: parseInt(process.env.SMTP_PORT || "465") === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"KheloIndore Hostinger" <${process.env.SMTP_USER}>`,
      to: "swapinfotechindore@gmail.com",
      subject: "Test Hostinger Mailer",
      html: "<h3>This is a test from Hostinger transporter</h3>",
    });
    console.log("Hostinger success:", info.messageId);
    return true;
  } catch (err) {
    console.error("Hostinger failed:", err.message || err);
    return false;
  }
}

async function run() {
  const g = await testGmail();
  const h = await testHostinger();
  process.exit(0);
}

run();
