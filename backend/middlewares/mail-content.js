exports.user_booked_mail = (name, message,mail_heading) => {
    let mailcontent = `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      
        <style type="text/css">
          table, td { color: #000000; } a { color: #236fa1; text-decoration: underline; }
    @media only screen and (min-width: 620px) {
      .u-row {
        width: 600px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
    
      .u-row .u-col-100 {
        width: 600px !important;
      }
    
    }
    
    @media (max-width: 620px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: calc(100% - 40px) !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }
    
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    
    p {
      margin: 0;
    }
    
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    
    * {
      line-height: inherit;
    }
    
    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }
    
    </style>
      
      
    
    <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css"><!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
        
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #11959c;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #11959c;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          
          <img align="center" border="0" src="https://kheloindore.in/assets/img/khelo-Indore-Logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 23%;max-width: 90.4px;" width="90.4"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e8eced;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e8eced;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:44px 10px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          
          <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1596348374204-dddd.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 100.8px;" width="100.8"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #34495e; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 26px; line-height: 36.4px;"><strong><span style="line-height: 36.4px; font-size: 26px;">${mail_heading}</span></strong></span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 33px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #686d6d; line-height: 210%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 210%;"><span style="font-size: 16px; line-height: 33.6px;">Dear ${name},</span></p>
    <p style="font-size: 14px; line-height: 210%;">${message}</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #009fa6;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #009fa6;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:44px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #d5fcff; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 26px; line-height: 36.4px;"><strong>EXPERIENCE THE WONDER</strong></span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px 0px 4px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 0px 4px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:44px 10px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          
          <img align="center" border="0" src="https://kheloindore.in/assets/img/khelo-Indore-Logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 22%;max-width: 127.6px;" width="127.6"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 33px 10px;font-family:'Montserrat',sans-serif;" align="left">
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:22px 44px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #a6acb1; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
    <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 12px; line-height: 16.8px;">Copyright &copy; 2019 Khelo Indore. All rights reserved.</span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 40px;font-family:'Montserrat',sans-serif;" align="left">
            
    <div align="center">
      <div style="display: table; max-width:247px;">
      <!--[if (mso)|(IE)]><table width="247" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:247px;"><tr><![endif]-->
      
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 30px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 30px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.facebook.com/kheloindore/" title="Facebook" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 30px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 30px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://twitter.com/kheloindore/" title="Twitter" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/twitter.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 30px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 30px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.youtube.com/channel" title="YouTube" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/youtube.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.instagram.com/kheloindore/" title="Instagram" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        
        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>
  
     `;
    return mailcontent
  }
  exports.super_admin_add_booked_mail = (name, mobile,email,password,role) => {
    let mailcontent = `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      
        <style type="text/css">
          table, td { color: #000000; } a { color: #236fa1; text-decoration: underline; }
    @media only screen and (min-width: 620px) {
      .u-row {
        width: 600px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
    
      .u-row .u-col-100 {
        width: 600px !important;
      }
    
    }
    
    @media (max-width: 620px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: calc(100% - 40px) !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }
    
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    
    p {
      margin: 0;
    }
    
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    
    * {
      line-height: inherit;
    }
    
    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }
    
    </style>
      
      
    
    <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css"><!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
        
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #11959c;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #11959c;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="50%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;">
          
          <img border="0" src="https://kheloindore.in/assets/img/khelo-Indore-Logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 23%;max-width: 90.4px;" width="90.4"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e8eced;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e8eced;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:44px 10px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          
          <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1596348374204-dddd.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 100.8px;" width="100.8"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #34495e; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 26px; line-height: 36.4px;"><strong><span style="line-height: 36.4px; font-size: 26px;">You are registed by Super Admin</span></strong></span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 33px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #686d6d; line-height: 210%; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 210%;"><span style="font-size: 16px; line-height: 13.6px;">Dear ${name},</span></p>
         <p style="font-size: 14px; line-height: 210%;"><span style="font-size: 16px; line-height: 13.6px;">Email ${email},</span></p>
          <p style="font-size: 14px; line-height: 210%;"><span style="font-size: 16px; line-height: 13.6px;">Mobile ${mobile},</span></p>
           <p style="font-size: 14px; line-height: 210%;"><span style="font-size: 16px; line-height: 13.6px;">Role ${role},</span></p>
            <p style="font-size: 14px; line-height: 210%;"><span style="font-size: 16px; line-height: 13.6px;">password ${password},</span></p>
    <p style="font-size: 14px; line-height: 210%;">This is login password for one time and change for security purpose</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #009fa6;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #009fa6;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:44px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #d5fcff; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 26px; line-height: 36.4px;"><strong>EXPERIENCE THE WONDER</strong></span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px 0px 4px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 0px 4px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:44px 10px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 0px;padding-left: 0px;" align="center">
          
          <img align="center" border="0" src="https://kheloindore.in/assets/img/khelo-Indore-Logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 22%;max-width: 127.6px;" width="127.6"/>
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 33px 10px;font-family:'Montserrat',sans-serif;" align="left">
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:22px 44px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #a6acb1; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
    <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 12px; line-height: 16.8px;">Copyright &copy; 2019 Khelo Indore. All rights reserved.</span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 40px;font-family:'Montserrat',sans-serif;" align="left">
            
    <div align="center">
      <div style="display: table; max-width:247px;">
      <!--[if (mso)|(IE)]><table width="247" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:247px;"><tr><![endif]-->
      
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 30px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 30px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.facebook.com/kheloindore/" title="Facebook" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 30px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 30px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://twitter.com/kheloindore/" title="Twitter" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/twitter.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 30px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 30px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.youtube.com/channel" title="YouTube" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/youtube.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
        <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
          <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <a href="https://www.instagram.com/kheloindore/" title="Instagram" target="_blank">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
            </a>
          </td></tr>
        </tbody></table>
        <!--[if (mso)|(IE)]></td><![endif]-->
        
        
        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
      </div>
    </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>
  
     `;
    return mailcontent
  }

  exports.super_admin_add_user_venue_admin = (first_name, last_name, mobile, email, password, role) => {
    // Determine the URL based on role
    let url;
    switch (role) {
      case "Venue Admin":
        url = "https://kheloindore.in/admin";
        break;
      case "Coach":
        url = "https://kheloindore.in/admin";
        break;
      case "Personal Trainer":
        url = "https://kheloindore.in/admin";
        break;
      default:
        url = "https://kheloindore.in";
    }
     
    let mailcontent = `
     <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <!-- Header Section -->
            <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
              <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
              <h1 style="font-size: 24px; color: #fff; margin: 0;">Welcome to KheloIndore</h1>
            </div>
          
            <!-- Content Section -->
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Dear ${first_name} ${last_name},</p>
              <p style="font-size: 14px; margin: 15px 0;">
                You have been successfully registered by the Super Admin with the following details:
              </p>
              <ul style="font-size: 14px; margin: 15px 0; padding-left: 20px;">
                <li><strong>Name:</strong> ${first_name} ${last_name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Mobile:</strong> ${mobile}</li>
                <li><strong>Role:</strong> ${role}</li>
                <li><strong>Password:</strong> ${password}</li>
              </ul>
              <p style="font-size: 14px; margin: 15px 0;">
                You can now log in using the above credentials on 
                <a href="${url}" style="color: #ff5f15; text-decoration: none;">KheloIndore.in</a>.
              </p>
              <p style="font-size: 14px; margin: 15px 0;">
                <strong>For your security, we recommend changing your password after your first login.</strong>
              </p>
              <p style="font-size: 14px; margin: 15px 0;">
                If you have any questions or need assistance, please feel free to contact us at 
                <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
              </p>
              <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
              <p style="font-size: 14px;">Team<br>KheloIndore</p>
            </div>
          
            <!-- Footer Section -->
            <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
              <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
              <p style="margin: 0;">For support, contact us at 
                <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
              </p>
            </div>
          </div>
    </body>
    </html>
    `;
    return mailcontent;
  };
  

  exports.super_admin_add_venue_to_venue_admin = (
    venue_owner_name,
    venue_name,
    venue_location,
    venue_contact
  ) => {
    const mailcontent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; max-width: 600px; margin: auto;">
          <!-- Header Section -->
          <div style="background-color: #ff5f15; color: #fff; text-align: center; padding: 20px;">
            <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore" style="max-width: 100px; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to KheloIndore</h1>
          </div>
        
          <!-- Content Section -->
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Dear ${venue_owner_name},</p>
            <p style="font-size: 14px; margin: 15px 0;">
              We are pleased to inform you that your venue has been successfully added on KheloIndore by the Super Admin.
            </p>
            <p style="font-size: 14px; margin: 15px 0;">
              Your venue details are as follows:
            </p>
            <ul style="font-size: 14px;">
              <li><strong>Venue Name:</strong> ${venue_name}</li>
              <li><strong>Location:</strong> ${venue_location}</li>
              <li><strong>Contact Number:</strong> ${venue_contact}</li>
            </ul>
            <p style="font-size: 14px;">
              You can now manage your venue through the platform. To get started, please log in using the credentials provided earlier.
            </p>
            <p style="font-size: 14px;">
              If you have any questions or need assistance, feel free to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
            </p>
            <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
            <p style="font-size: 14px;">Team<br>KheloIndore</p>
          </div>
        
          <!-- Footer Section -->
          <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
            <p style="margin: 0;">For support, contact us at 
              <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
    `;
    return mailcontent;
  };
  
        
  exports.super_admin_approval_for_venue = (venueAdminName, venueName, venueLocation, venueAdminEmail, submissionDate) => {
    const formattedDate = new Date(submissionDate).toString().split(' GMT')[0];
    const mailcontent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <!-- Header Section -->
          <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
            <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
            <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
          </div>
        
          <!-- Content Section -->
          <div style="padding: 20px;">
            <p>Dear Super Admin,</p>
            <p>A new venue has been added by <strong>${venueAdminName}</strong> and is pending your review for approval or rejection. Below are the details of the venue:</p>
            <ul>
              <li><strong>Venue Name:</strong> ${venueName}</li>
              <li><strong>Location:</strong> ${venueLocation}</li>
              <li><strong>Added By:</strong> ${venueAdminName} (${venueAdminEmail})</li>
              <li><strong>Submission Date:</strong> ${formattedDate}</li>
            </ul>
            <p>Please log in to the admin panel to review the venue details and take necessary action:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="https://kheloindore.in/admin" target="_blank" style="color: #fff; background-color: #ff5f15; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Venue</a>
            </p>
            <p>If you have any questions or need assistance, please contact the KheloIndore support team at 
              <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
            </p>
            <p><strong>Best Regards,</strong><br>Team<br></p>
            <p>KheloIndore</p>
          </div>
        
          <!-- Footer Section -->
          <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
            <p style="margin: 0;">For support, contact us at 
              <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
            </p>
          </div>
        </div>
  </body>
  </html>
     `;
      return mailcontent; // Correct return of the mail content
  }



exports.sendBookingRequestEmail = (
  entityType,
  adminName,
  users,
  venueName,
  venueLocation,
  slotDate,
  slotTime,
  totalPrice,
  recipientEmail,
) => { 
 
    const mailcontent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title> ${entityType} bookingRequest</title>
      </head>
      <body>
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
                  <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
                  <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore - ${entityType} Booking Request</h1>
              </div>
              <div style="padding: 20px;">
                  <p style="font-size: 16px;">Dear ${adminName},</p>
                  <p style="font-size: 14px; margin: 15px 0;">
                      A new ${entityType} booking request has been received by a user. Please find the details below:
                  </p>
                  <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
                      <li><strong>Name:</strong> ${users}</li>
                      <li><strong>Email:</strong> ${recipientEmail}</li>
                      <li><strong>${entityType}:</strong> ${venueName}</li>
                      <li><strong>Location:</strong> ${venueLocation}</li>
                      <li><strong>Slot Date:</strong> ${slotDate}</li>
                      <li><strong>Slot Time:</strong> ${slotTime}</li>
                      <li><strong>Total Amount:</strong> ₹${totalPrice}</li>
                  </ul>
                  <p style="font-size: 14px; margin: 15px 0;">
                      You can either approve or reject this booking request based on availability and other criteria. To confirm or reject, please click on below link:
                      <a href="https://kheloindore.in/admin" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>
                  </p>        
                  <p style="font-size: 14px; margin: 15px 0;">
                      If you need more details about this request, please feel free to reach out to the support team.
                  </p>
                  <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
                  <p style="font-size: 14px;">Team<br>KheloIndore</p>
              </div>
              <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
                  <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
                  <p style="margin: 0;">For support, contact us at 
                      <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;
    return mailcontent
};

exports.sendBookingEmailToApprovalToAdmin = (
  adminName,
  user,
  entityType, // Either "Coach" or "Personal Trainer"
  entityName, // Name of the Coach or Personal Trainer
  entityLocation, // Location for Coach or Personal Trainer
  slotDate,
  slotTime,
  totalPrice,
  recipientEmail,
) => {
  const mailcontent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <!-- Header Section -->
            <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
                <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
                <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
            </div>
        
            <!-- Content Section -->
            <div style="padding: 20px;">
                <p style="font-size: 16px;">Dear ${user},</p>
                <p style="font-size: 14px; margin: 15px 0;">
                    Thank you for booking with KheloIndore. Please wait for booking confirmation.<br> Below are your booking details:
                </p>
                <ul style="font-size: 14px; margin: 15px 0; padding-left: 20px;">
                   <li><strong>Booked For:</strong> ${entityType}</li>
                   <li><strong>${entityType} Name:</strong> ${entityName}</li>
                   <li><strong>Location:</strong> ${entityLocation}</li>
                   <li><strong>Slot Date:</strong> ${slotDate}</li>
                   <li><strong>Slot Time:</strong> ${slotTime}</li>
                   <li><strong>Total Amount:</strong> ₹${totalPrice}</li>
                   <li><strong>Email:</strong> ${recipientEmail}</li>
                </ul>
                  <p style="font-size: 14px; margin: 15px 0; font-weight: bold;">
        You can cancel your booking within 2 hours. After 2 hours, cancellations will not be allowed.
      </p>
                <p style="font-size: 14px; margin: 15px 0;">
                    We are excited to host you. If you have any questions about your booking or need assistance, feel free to contact us.
                </p>
                
                <p style="font-size: 14px; margin: 15px 0;">
                    For support, you can reach us at 
                    <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
                </p>
                <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
                <p style="font-size: 14px;">Team<br>KheloIndore</p>
            </div>
        
            <!-- Footer Section -->
            <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
                <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
                <p style="margin: 0;">For support, contact us at 
                    <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
  return mailcontent;
};


exports.BookingConfirmedandEmailSentToUser = (
  adminName,
  user,
  venueName,
  venueLocation,
  formattedSlotDate,
  slotTime,
  totalPrice,
  recipientEmail,
  userRole
) => {
  let formattedSlotTimes;

  // Ensure slotTime is handled correctly
  if (Array.isArray(slotTime)) {
    formattedSlotTimes = slotTime
      .map(slot => `${slot.startTime} - ${slot.endTime}`)
      .join(', '); // Join multiple slots with commas
  } else {
    // If slotTime is not an array, use it directly or set default
    formattedSlotTimes = slotTime || "N/A";
  }

// Format the total price with currency symbol
const formattedTotalPrice = totalPrice ? `₹${totalPrice}` : "N/A";
  const mailcontent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bookingAccepeted</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Confirmation</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${user},</p>
          <p style="font-size: 14px; margin: 15px 0;">
            We are pleased to inform you that your booking request for the ${userRole} has been successfully confirmed. Below are the details of your booking:
          </p>
          
          <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
        <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
                    <li><strong>${userRole}</strong> ${venueName || "N/A"}</li>               
                    <li><strong>Slot Date:</strong> ${formattedSlotDate}</li>
                    <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
                    <li><strong>Total Amount:</strong> ${formattedTotalPrice}</li>
                </ul>
                  
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions or need further assistance, please feel free to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
      
</body>
</html>
  `;
  return mailcontent;
};
exports.abcBookingPendingReminder= (
  adminName,
  user,
  venueName,
  venueLocation,
  formattedSlotDate,
  slotTime,
  totalPrice,
  recipientEmail,
  userRole
) => {
  let formattedSlotTimes;

  // Ensure slotTime is handled correctly
  if (Array.isArray(slotTime)) {
    formattedSlotTimes = slotTime
      .map(slot => `${slot.startTime} - ${slot.endTime}`)
      .join(', '); // Join multiple slots with commas
  } else {
    // If slotTime is not an array, use it directly or set default
    formattedSlotTimes = slotTime || "N/A";
  }

// Format the total price with currency symbol
const formattedTotalPrice = totalPrice ? `₹${totalPrice}` : "N/A";
  const mailcontent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bookingAccepeted</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Confirmation</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${user},</p>          
     <p style="font-size: 16px;">Dear Super Admin,</p>
            <p style="font-size: 14px; margin: 15px 0;">
                A ${userRole} booking is pending for approval or rejection from the assigned <strong>${userRole}</strong>. Please review the details below and take the necessary action.
            </p>

          <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
        <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
                    <li><strong>${userRole}</strong> ${venueName || "N/A"}</li>               
                    <li><strong>Slot Date:</strong> ${formattedSlotDate}</li>
                    <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
                    <li><strong>Total Amount:</strong> ${formattedTotalPrice}</li>
                </ul>
                  
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions or need further assistance, please feel free to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
      
</body>
</html>
  `;
  return mailcontent;
};


exports.BookingPendingReminder = (
  user, venueName, formattedSlotDate, slotTime, totalPrice, userEmail, role
) => {

  let formattedSlotTimes;
  
  // Ensure slotTime is handled correctly
  if (Array.isArray(slotTime)) {
    formattedSlotTimes = slotTime
      .map(slot => `${slot.startTime} - ${slot.endTime}`)
      .join(', '); // Join multiple slots with commas
  } else {
    formattedSlotTimes = slotTime || "N/A";
  }

  // Format the total price with currency symbol
  const formattedTotalPrice = totalPrice ? `₹${totalPrice}` : "N/A";

  const mailcontent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Pending Reminder</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            
            <!-- Header Section -->
            <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
                <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
                <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Confirmation</h1>
            </div>
            
            <!-- Content Section -->
            <div style="padding: 20px;">
                <p style="font-size: 16px;">Dear Super Admin,</p>
                <p style="font-size: 14px; margin: 15px 0;">
                    A <strong>${role}</strong> booking is pending for approval or rejection from the assigned <strong>${role}</strong>. Please review the details below and take the necessary action.
                </p>

                <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
                    <li><strong>name:</strong> ${venueName || "N/A"}</li>               
                    <li><strong>Slot Date:</strong> ${formattedSlotDate}</li>
                    <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
                    <li><strong>Total Amount:</strong> ${formattedTotalPrice}</li>
                </ul>

                <p style="font-size: 14px; margin: 15px 0;">
                    If you have any questions or need further assistance, please feel free to contact us at 
                    <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
                </p>
                
                <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
                <p style="font-size: 14px;">Team<br>KheloIndore</p>
            </div>
            
            <!-- Footer Section -->
            <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
                <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
                <p style="margin: 0;">For support, contact us at 
                    <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return mailcontent;
};

exports.nBookingConfirmedandEmailSentToUser = (
  adminName,
  user,
  venueName,
  venueLocation,
  formattedSlotDate,
  slotTime,
  totalPrice,
  recipientEmail,
  userRole // Add role as a parameter
) => {
  // Format slot times if they are provided as an array
  const formattedSlotTimes = Array.isArray(slotTime)
    ? slotTime.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ')
    : slotTime || "N/A";

  // Format the total price with currency symbol
  const formattedTotalPrice = totalPrice ? `₹${totalPrice}` : "N/A";

  // Format the slot date
  

  // Role-specific content
  let roleSpecificContent = '';
  switch (userRole) {
    case 'Venue Admin':
      roleSpecificContent = `
        <p style="font-size: 14px; margin: 15px 0;">
          As a Venue Admin, you can manage this booking and view other bookings for your venue through your dashboard.
        </p>
      `;
      break;
    case 'Coach':
      roleSpecificContent = `
        <p style="font-size: 14px; margin: 15px 0;">
          As a Coach, you can view your upcoming sessions and manage your schedule through your dashboard.
        </p>
      `;
      break;
    case 'Personal Trainer':
      roleSpecificContent = `
        <p style="font-size: 14px; margin: 15px 0;">
          As a Personal Trainer, you can manage your training sessions and view your schedule through your dashboard.
        </p>
      `;
      break;
    default:
      roleSpecificContent = `
        <p style="font-size: 14px; margin: 15px 0;">
          You can manage your bookings and view your schedule through your dashboard.
        </p>
      `;
  }

  // HTML template for the email
  const mailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <!-- Header Section -->
            <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
                <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
                <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Confirmation</h1>
            </div>
          
            <!-- Content Section -->
            <div style="padding: 20px;">
                <p style="font-size: 16px;">Dear ${user},</p>
                <p style="font-size: 14px; margin: 15px 0;">
                    We are pleased to inform you that your booking request has been successfully confirmed. Below are the details of your booking:
                </p>
                
                <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
                    <li><strong>${userRole}</strong> ${venueName || "N/A"}</li>               
                    <li><strong>Slot Date:</strong> ${formattedSlotDate}</li>
                    <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
                    <li><strong>Total Amount:</strong> ${formattedTotalPrice}</li>
                </ul>
                
                ${roleSpecificContent}
                
                <p style="text-align: center; margin: 20px 0;">
                    <!-- Add a link to download the invoice here -->
                    <a href="https://kheloindore.in/invoice" style="background-color: #ff5f15; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Invoice</a>
                </p>
                
                <p style="font-size: 14px; margin: 15px 0;">
                    If you have any questions or need further assistance, please feel free to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
                </p>
                <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
                <p style="font-size: 14px;">Team<br>KheloIndore</p>
            </div>
          
            <!-- Footer Section -->
            <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
                <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
                <p style="margin: 0;">For support, contact us at 
                    <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  return mailContent;
};
exports.bookingRejectionTemplate = (
  user, venueName, rejection_message,userRole 
) => {
  const mailcontent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bookingRejection</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Status</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${user},</p>
          <p style="font-size: 14px; margin: 15px 0;">
            We regret to inform you that your booking request for the  <strong>${userRole}</strong> has been <strong>rejected</strong>.
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            Reason for rejection: <strong>${rejection_message}</strong>
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions or concerns, please do not hesitate to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
      
</body>
</html>
  `;
  return mailcontent;
};
exports.bookingRejectionTemplate1 = (
  user, venueName, rejection_message,userRole 
) => {
  
  const mailcontent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bookingRejection</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Status</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear admin,</p>
         <p style="font-size: 14px; margin: 15px 0;">
            We regret to inform you that the booking request from ${user} for the <strong>${venueName}</strong> has been <strong>rejected</strong>.
          </p
          <p style="font-size: 14px; margin: 15px 0;">
            Reason for rejection: <strong>${rejection_message}</strong>
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions or concerns, please do not hesitate to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
      
</body>
</html>
  `;
  return mailcontent;
};

exports.generateUnifiedPdfInvoice = (pdfData) => {
  const mailcontent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Invoice</title>
      <style>
          body {
              font-family: 'Poppins', sans-serif;
              background-color: #f8f8f8;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 800px;
              margin: 30px auto;
              background: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              border: 1px solid #ddd;
          }
          .header {
              display: flex;
              justify-content: space-between;
              padding: 15px;
              background-color: #ff5f15;
              color: #fff;
              border-radius: 8px 8px 0 0;
          }
          .header img {
              max-height: 50px;
          }
          .header div {
              text-align: right;
          }
          .header h1, .header h2 {
              margin: 0;
          }
          .section {
              padding: 20px;
              margin: 10px;
              border: 1px solid #ddd;
              border-radius: 8px;
          }
          .section-title {
              margin-bottom: 8px;
              font-weight: 600;
              font-size: 18px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
          }
          table, th, td {
              border: 1px solid #ddd;
          }
          th, td {
              padding: 10px;
              text-align: left;
          }
          th {
              background-color: #f4f4f4;
          }
          .thanks {
              text-align: center;
              font-weight: bold;
              margin: 30px 0;
          }
          .terms {
              font-size: 14px;
              color: #555;
              text-align: center;
          }
      </style>
  </head>
  <body>

  <div class="container">
      <!-- Header -->
      <div class="header">
          <img src="https://kheloindore.in/admin/static/media/Group%2086.186dd0c677745609f0db.png" alt="KheloIndore Logo">
          <div>
              <h1>Invoice</h1>
              <h2>kheloindore.in</h2>
          </div>
      </div>

      <!-- Billed To -->
      <div class="section">
          <div class="section-title">Billed To:</div>
          <p><strong>${pdfData.first_name || "N/A"} ${pdfData.last_name || ""}</strong></p>
          <p>Mobile: ${pdfData.mobile || "N/A"}</p>
          <p>Email: ${pdfData.email || "N/A"}</p>
          <p>Date of Booking: ${pdfData.bookDate || "N/A"}</p>
          <p>Date of Invoice: ${pdfData.bookDate || "N/A"}</p>
      </div>

      <!-- Booking Details -->
      <div class="section">
          <div class="section-title">${pdfData.entityType} Booking Details:</div>
          <table>
              <tbody>
                  <tr>
                      <th>${pdfData.entityType} Name</th>
                      <td>${pdfData.entityName || "N/A"}</td>
                  </tr>
                  <tr>
                      <th>Slot</th>
                      <td>${pdfData.slotsBooked || "N/A"}</td>
                  </tr>
                  <tr>
                      <th>Date</th>
                      <td>${pdfData.date|| "N/A"}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      <!-- Payment Details -->
      <div class="section">
          <div class="section-title">Payment Details:</div>
          <table>
              <thead>
                  <tr>
                      <th>Payment Status</th>
                      <th>Transaction ID</th>
                      <th>Merchant Transaction ID</th>
                      <th>Total Amount</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>${pdfData.status || "N/A"}</td>
                      <td>${pdfData.transactionId || "N/A"}</td>
                      <td>${pdfData.merchantTransaction_id || "N/A"}</td>
                      <td>₹${pdfData.total_price ? pdfData.total_price.toFixed(2) : "0.00"}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      <!-- Thank You Note -->
      <div class="thanks">Thank you for booking with us!</div>

      <!-- Terms & Conditions -->
      <div class="terms">
          <p>All disputes are subjected to Indore Jurisdiction only.</p>
      </div>
  </div>

  </body>
  </html>
  `;

  return mailcontent;
};



exports.generateResetPasswordMailContent = (
  first_name, last_name, otp
)=> {
  const mailcontent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - KheloIndore</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 30px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-color: #fff;">
      <!-- Header Section -->
      <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
        <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
        <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
      </div>

      <!-- Content Section -->
      <div style="padding: 20px;">
        <p style="font-size: 16px; margin: 0;">Dear <strong>${first_name} ${last_name}</strong>,</p>
        <p style="font-size: 14px; margin: 15px 0;">
          We have received a request to reset the password for your KheloIndore account. Please use the One-Time Password (OTP) below to complete the process:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; padding: 15px 30px; font-size: 20px; font-weight: bold; color: #ff5f15; background-color: #fff; border: 2px dashed #ff5f15; border-radius: 8px;">${otp}</span>
        </div>
        <p style="font-size: 14px; margin: 15px 0;">
          Please note that this OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email or contact us immediately.
        </p>
        <p style="font-size: 14px; margin: 15px 0;">
          If you need assistance, please visit our 
          <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: underline;">Contact Us</a> page.
        </p>
        <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
        <p style="font-size: 14px;">Team KheloIndore</p>
      </div>

      <!-- Footer Section -->
      <div style="background-color: #f9f9f9; padding: 15px 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
        <p style="margin: 5px 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
        <p style="margin: 5px 0;">For support, contact us at 
          <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: underline;">kheloindore.in</a>.
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
  return mailcontent;
}

// emailTemplates.js

exports.venueAdminTemplate = (
  user, password
)=> {
  const mailcontent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <!-- Header Section -->
    <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
      <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
      <h1 style="font-size: 24px; color: #fff; margin: 0;">Welcome to KheloIndore</h1>
    </div>
  
    <!-- Content Section -->
    <div style="padding: 20px;">
      <p>We are pleased to inform you that your registration as a ${user.role} has been successfully processed.</p>
      <p><strong>Mobile Number:</strong> ${user.mobile}</p>
      <p><strong>Temporary Password:</strong> ${password}</p>
      <p>You can now log in to your admin dashboard using the following link:</p>
      <p>
        <a href="https://kheloindore.in/admin" style="color: #ff5f15; text-decoration: none;">Admin Dashboard</a>
      </p>
      <p>If you have any questions or need assistance, please feel free to reach out to our support team.</p>
      <p>Thank you for joining the KheloIndore team!</p>
      <br>
      <p><strong>Best Regards,</strong><br>Team<br>KheloIndore</p>
    </div>
  
    <!-- Footer Section -->
    <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
      <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
      <p style="margin: 0;">For support, contact us at 
        <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
      </p>
    </div>
  </div>
  `;
  return mailcontent;
}

exports.acancellationEmailTemplate=(venueAdmin, user, booking, venue)=> {
  const mailcontent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Booking Cancellation Notification</title>
  </head>
  <body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear Admin,</p>
          <p style="font-size: 14px;">We wanted to inform you that a booking for your ${role} has been <strong>cancelled</strong> by the user.</p>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${user.first_name} ${user.last_name}</li>
             <li><strong>Venue Name:</strong> ${venue.name}</li>
            <li><strong>Slot Time:</strong> ${booking._id}</li>         
            <li><strong>Slot Date:</strong> ${booking.date}</li>
            <li><strong>Cancelled On:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="font-size: 16px;"><strong>Best regards,</strong></p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.</p>
        </div>
      </div>
  </body>
</html>
  `;
  return mailcontent;
};

exports.cancellationEmailTemplate = (
  coachName,
  user,
  formattedSlotDate,
  formattedSlotTimes,
  role,
  bookingDate
) => {
  const mailcontent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Booking Cancellation Notification</title>
  </head>
  <body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear,</p>
          <p style="font-size: 14px;">We wanted to inform you that a booking for <strong>${coachName}</strong> (${role}) has been <strong>cancelled</strong>.</p>
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>${role}:</strong> ${coachName}</li>          
            <li><strong>User Name:</strong> ${user.first_name} ${user.last_name}</li>
            <li><strong>Slot Date:</strong> ${formattedSlotDate}</li>
            <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
            <li><strong>Booking Date:</strong> ${bookingDate}</li>
            <li><strong>Cancelled On:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="font-size: 16px;"><strong>Best regards,</strong></p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.</p>
        </div>
      </div>
  </body>
</html>
  `;
  return mailcontent;
};

exports.generateBookingEmail = (
  adminName,
  user,
  venueName,
  venueLocation,
  slotDate,
  slotTime,
  totalPrice,
  recipientEmail,
  role
) => {
  const formattedSlotTimes = slotTime
    .map(slot => `${slot.startTime} - ${slot.endTime}`)
    .join(', ');

  let roleSpecificMessage = '';
  let venueDetails = '';

  // Customize the content based on the role
  if (role === 'Venue Admin') {
    roleSpecificMessage = `
      <p style="font-size: 14px; margin: 15px 0;">
        As the venue administrator, you are responsible for managing bookings and ensuring smooth operations. Below are the details of the booking:
      </p>
      <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
        <li><strong>Venue Name:</strong> ${venueName}</li>
        <li><strong>Location:</strong> ${venueLocation}</li>
        <li><strong>Slot Date:</strong> ${slotDate}</li>
        <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
        <li><strong>Total Amount:</strong> ₹${totalPrice}</li>
      </ul>
    `;
  } else if (role === 'Coach') {
    roleSpecificMessage = `
      <p style="font-size: 14px; margin: 15px 0;">
        As the coach, you are responsible for confirming the schedule and ensuring the availability of the venue for the training session.
      </p>
      <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
        <li><strong>Slot Date:</strong> ${slotDate}</li>
        <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
        <li><strong>Total Amount:</strong> ₹${totalPrice}</li>
      </ul>
    `;
  } else if (role === 'Personal Trainer') {
    roleSpecificMessage = `
      <p style="font-size: 14px; margin: 15px 0;">
        As the personal trainer, you can review your session details and ensure you're prepared for the upcoming booking.
      </p>
      <ul style="font-size: 14px; list-style-type: none; padding-left: 0;">
        <li><strong>Slot Date:</strong> ${slotDate}</li>
        <li><strong>Slot Time:</strong> ${formattedSlotTimes}</li>
        <li><strong>Total Amount:</strong> ₹${totalPrice}</li>
      </ul>
    `;
  }

  const mailContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore Booking Confirmation</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${user},</p>
          <p style="font-size: 14px; margin: 15px 0;">
            We are pleased to inform you that your booking request has been successfully confirmed. Below are the details of your booking:
          </p>

          ${roleSpecificMessage}
          
          <p style="font-size: 14px; margin: 15px 0;">
            To view and download your invoice, please click the link below:
          </p>
          <p style="text-align: center; margin: 20px 0;">
            <!-- Insert invoice link here -->
          </p>
          
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions or need further assistance, please feel free to contact us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
</body>
</html>
  `;

  return mailContent;
};

// Email sent to a newly registered Coach/Trainer with a link to complete their profile
exports.onboarding_profile_link = (name, completeLink) => {
  let mailContent = `
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Complete Your Profile</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            <tr>
              <td style="background: linear-gradient(135deg, #22C55E 0%, #15803D 100%); padding: 28px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 22px;">Khelo Indore</h1>
                <p style="margin: 6px 0 0; color: #dcfce7; font-size: 13px;">Welcome to the team!</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="margin: 0 0 12px; color: #0f172a; font-size: 16px;">Dear ${name},</p>
                <p style="margin: 0 0 14px; color: #334155; font-size: 14px; line-height: 1.7;">
                  Congratulations on registering as a Coach/Trainer with Khelo Indore! Your account has been created successfully.
                </p>
                <p style="margin: 0 0 14px; color: #334155; font-size: 14px; line-height: 1.7;">
                  To start receiving bookings, please complete your profile by clicking the button below. You will be able to add your
                  specialization, experience, coaching levels, hourly rate, availability and more.
                </p>
                <p style="text-align: center; margin: 26px 0;">
                  <a href="${completeLink}" style="display: inline-block; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: #ffffff; text-decoration: none; padding: 13px 34px; border-radius: 50px; font-size: 15px; font-weight: bold;">
                    Complete My Profile
                  </a>
                </p>
                <p style="margin: 0 0 14px; color: #64748b; font-size: 13px; line-height: 1.7;">
                  If the button doesn't work, copy and paste this link in your browser:
                </p>
                <p style="margin: 0 0 14px; color: #22C55E; font-size: 12px; word-break: break-all;">${completeLink}</p>
                <p style="margin: 20px 0 0; color: #475569; font-size: 14px;">Best Regards,<br/>Team Khelo Indore</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 16px 30px; text-align: center; font-size: 12px; color: #94a3b8;">
                This email was sent by Khelo Indore. For support, contact us at kheloindore.in/contact-us
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  return mailContent;
};

