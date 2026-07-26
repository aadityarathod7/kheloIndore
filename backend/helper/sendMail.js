const  nodemailer = require('nodemailer')
const fs = require( 'fs')
const path = require( 'path')

 const sendEmail = async (email,mailcontent,attachedFiles) => {
  console.log(email,"attachedFiles6")
    // let transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: "mailto:swapinfotechindore@gmail.com",
    //       pass: "ejnljjxnhcautboc",
    //     },
    // })


    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });
    var mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
        to: email,
        subject: 'Booking Confirmation',
        html: mailcontent,
        attachments: attachedFiles
    };

    transporter.sendMail(mailOptions, function (err ,result) {
        if (err) {
            console.log(err);
        }
        console.log('Email has been sent on your email id');
    })
}
const sendEmailForSwap = async (email, subject, mailcontent,attachedFiles) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP hostname
    port: process.env.SMTP_PORT, // SMTP port
    secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
    auth: {
      user: process.env.SMTP_USER, // SMTP username
      pass: process.env.SMTP_PASS, // SMTP password
    },
  });

    var mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
        to: email,
        subject: subject,
        html: mailcontent,
    };

    transporter.sendMail(mailOptions, function (err ,result) {
        if (err) {
            console.log(err);
        }
        console.log('Email has been sent on your email id');
    })
}
const superAdminAddUsersendEmail = async (email,mailcontent) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP hostname
    port: process.env.SMTP_PORT, // SMTP port
    secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
    auth: {
      user: process.env.SMTP_USER, // SMTP username
      pass: process.env.SMTP_PASS, // SMTP password
    },
  });

    var mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
        to: email,
        subject: 'Login details',
        html: mailcontent
    };

    transporter.sendMail(mailOptions, function (err ,result) {
        if (err) {
            console.log(err);
        }
        console.log('Email has been sent on your email id');
    })
}



const sendVenuAdminConfirmation = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    // Create a transporter object using default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendVenueConfirnation = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    // Create a transporter object using default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendVenueAddBySuperadmin = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendBookingRequestEmail = async ({
  mailcontentuser,
  recipientEmail,
  venueName,
  attachmentInvoices
}) => {
  try {
    console.log("Sending email to:", recipientEmail); 
    console.log(attachmentInvoices,"attachmentInvoices")
    // Ensure recipientEmail is defined
    if (!recipientEmail) {
      throw new Error("No recipient email provided");
    }
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });


    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
      to: recipientEmail,
      subject: `Booking Request for ${venueName}`,
      html: mailcontentuser,
      attachments:attachmentInvoices
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

const sendBookingEmailToApprovalToVenueAdmin = async ({
  mailcontent,
  venueName,
  venueadminemail,
  attachmentInvoices,
}) => {
  try {
 
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });


    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
      to: venueadminemail,
      subject: `Booking Approval Required for ${venueName}`,
      html: mailcontent,
      attachmentInvoices

    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

const sendBookingEmailToApprovalToSuperAdmin = async ({
  mailcontent,
  subject 
}) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });
  
    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
      to: process.env.SUPER_ADMIN_EMAIL,
      subject: subject,
      html: mailcontent,
    }
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};


const generateResetPasswordMailContent = async (email, html) => {
  try {
    // Configure the nodemailer transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    // Define email options
    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
      to: email, // Recipient email
      subject: "Password Reset Request", // Email subject
      html: html, // HTML content
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}:`, result);
  } catch (error) {
    // Log errors for debugging
    console.error("Error sending email:", error.message);
  }
};

const sendEmailConfirm = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    // Create a transporter object using default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: true,// Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const cancellationEmail = async ({recipientEmail, subject, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP hostname
      port: process.env.SMTP_PORT, // SMTP port
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

  var mailOptions = {
    from: `"KheloIndore" <${process.env.SMTP_USER}>`, // Sender email
      to: recipientEmail,
      subject: subject,
      html: html,
  };

  transporter.sendMail(mailOptions, function (err ,result) {
      if (err) {
          console.log(err);
      }
      console.log('Email has been sent on your email id');
  })
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
    sendEmail,
    sendEmailForSwap,
    superAdminAddUsersendEmail,
    sendVenuAdminConfirmation,
    sendVenueConfirnation,
    sendVenueAddBySuperadmin,
    sendBookingRequestEmail,
    sendBookingEmailToApprovalToVenueAdmin,
    sendBookingEmailToApprovalToSuperAdmin,
    generateResetPasswordMailContent,
    sendEmailConfirm,
    cancellationEmail,
}