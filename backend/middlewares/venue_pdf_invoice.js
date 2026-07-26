exports.venue_pdf_invoice = (pdfData) => {
  // Start building the HTML content
  const mailcontent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Venue Booking Invoice</title>
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

      <!-- Booking Details -->
      <div class="section">
          <div class="section-title">Billed To:</div>
          <p><strong>${pdfData.first_name || "N/A"} ${pdfData.last_name || ""}</strong></p>
          <p>Mobile: ${pdfData.mobile || "N/A"}</p>
          <p>Email: ${pdfData.email || "N/A"}</p>
          <p>Date of Booking: ${pdfData.bookDate || "N/A"}</p>
          <p>Date of Invoice: ${pdfData.bookDate || "N/A"}</p>
      </div>

      <!-- Venue and Slot Details -->
      <div class="section">
          <div class="section-title">Venue and Slot Details:</div>
          <table>
              <tbody>
                  <tr>
                      <th>Venue Name</th>
                      <td>${pdfData.venueName || "N/A"}</td>
                  </tr>
                  <tr>
                      <th>Slot</th>
                      <td>
      ${
          Array.isArray(pdfData.slotsBooked)
              ? pdfData.slotsBooked
                    .map(slot => `${slot.startTime} - ${slot.endTime}`) // Convert objects to a readable format
                    .join(", ") // Join the formatted strings
              : "N/A"
      }
  </td>
                  </tr>
                  <tr>
                      <th>Date & Time</th>
                      <td>${pdfData.date || pdfData.bookDate || "N/A"}</td>
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
