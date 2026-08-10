const express = require ("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

const dbConnect = require("./config/database");
dbConnect();
const bookingCron = require("./middlewares/cron_approval_email");
const { securityHeaders, corsOptions } = require("./middlewares/security");

// Uploaded files (incl. SVG) are rendered in a sandboxed context when
// navigated to directly, so embedded scripts can never execute (stored XSS).
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    setHeaders: (res) => {
      res.setHeader("Content-Security-Policy", "sandbox");
    },
  })
);
app.use("/pdf", express.static(path.join(__dirname, "public/pdf")));

// Security headers + restrictive CORS (only known app origins allowed)
app.use(securityHeaders);
app.use(cors(corsOptions));
// Cap JSON/urlencoded payloads to stop oversized request abuse
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use("/admin", express.static(path.join(__dirname, "public/admin/build/")));
app.use("/", express.static(path.join(__dirname, "public/site/build/")));
// Import routes
const mainRoute = require("./routes/AllRoutes");
app.use("/api", mainRoute);

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/build", "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/site/build", "index.html"));
});

// Central error handler: map multer/upload errors to a clean 400 JSON
// instead of a raw 500 HTML page.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const isMulterError =
    err &&
    typeof err === "object" &&
    (err.name === "MulterError" || /file type not allowed/i.test(err.message || ""));
  if (isMulterError) {
    return res.status(400).json({
      success: false,
      message: "Invalid file. Only images/PDFs/documents are allowed (max 10MB).",
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`[Success] Local backend server is running on http://localhost:${PORT}`);
});
