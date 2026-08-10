const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

// Dynamic Transporter Factory
const createMailTransporter = () => {
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Dynamic Sender Address
const getSenderEmail = () => {
  return process.env.EMAIL_SERVICE === "gmail" ? process.env.EMAIL_ID : process.env.SMTP_USER;
};

const sendEmail = async (email, mailcontent, attachedFiles) => {
  
  const transporter = createMailTransporter();
  var mailOptions = {
    from: `"KheloIndore" <${getSenderEmail()}>`,
    to: email,
    subject: 'Booking Confirmation',
    html: mailcontent,
    attachments: attachedFiles
  };

  transporter.sendMail(mailOptions, function (err, result) {
    if (err) {
      
    }
    
  })
}

const sendEmailForSwap = async (email, subject, mailcontent, attachedFiles) => {
  const transporter = createMailTransporter();
  var mailOptions = {
    from: `"KheloIndore" <${getSenderEmail()}>`,
    to: email,
    subject: subject,
    html: mailcontent,
  };

  transporter.sendMail(mailOptions, function (err, result) {
    if (err) {
      
    }
    
  })
}

const superAdminAddUsersendEmail = async (email, mailcontent) => {
  const transporter = createMailTransporter();
  var mailOptions = {
    from: `"KheloIndore" <${getSenderEmail()}>`,
    to: email,
    subject: 'Login details',
    html: mailcontent
  };

  transporter.sendMail(mailOptions, function (err, result) {
    if (err) {
      
    }
    
  })
}

const sendVenuAdminConfirmation = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const sendVenueConfirnation = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const sendVenueAddBySuperadmin = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const sendBookingRequestEmail = async ({
  mailcontentuser,
  recipientEmail,
  venueName,
  attachmentInvoices
}) => {
  try {
     
    
    if (!recipientEmail) {
      throw new Error("No recipient email provided");
    }
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: recipientEmail,
      subject: `Booking Request for ${venueName}`,
      html: mailcontentuser,
      attachments: attachmentInvoices
    };

    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const sendBookingEmailToApprovalToVenueAdmin = async ({
  mailcontent,
  venueName,
  venueadminemail,
  attachmentInvoices,
}) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: venueadminemail,
      subject: `Booking Approval Required for ${venueName}`,
      html: mailcontent,
      attachments: attachmentInvoices
    };

    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const sendBookingEmailToApprovalToSuperAdmin = async ({
  mailcontent,
  subject 
}) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: process.env.SUPER_ADMIN_EMAIL,
      subject: subject,
      html: mailcontent,
    }
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const generateResetPasswordMailContent = async (email, html) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: email,
      subject: "Password Reset Request",
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const sendEmailConfirm = async ({ senderEmail, senderName, recipientEmail, subject, html }) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    
  }
};

const cancellationEmail = async ({ recipientEmail, subject, html }) => {
  try {
    const transporter = createMailTransporter();
    var mailOptions = {
      from: `"KheloIndore" <${getSenderEmail()}>`,
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (err, result) {
      if (err) {
        
      }
      
    })
  } catch (error) {
    
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