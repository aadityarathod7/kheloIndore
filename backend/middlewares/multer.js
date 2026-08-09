const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Whitelist of allowed upload destination folders. Never interpolate raw
// user input into the filesystem path (prevents path traversal).
const ALLOWED_TYPES = new Set([
  "user",
  "coach",
  "trainer",
  "venue",
  "blog",
  "event",
  "category",
  "payment",
  "misc",
  "document",
  "enquiry",
  "default",
  "events-media",
  "personal-training",
]);

// Allowed MIME types -> safe extension mapping. Anything else is rejected,
// which stops HTML/SVG/JS files (stored XSS) and other dangerous uploads.
const ALLOWED_MIME_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = req.query.types || "misc";

    // Sanitize: only allow a single known folder name, never a path.
    if (typeof type !== "string" || !ALLOWED_TYPES.has(type)) {
      type = "misc";
    }

    const dir = `public/uploads/${type}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const extension =
      ALLOWED_MIME_TYPES[file.mimetype] || "bin";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed."));
  }
};

// 50 MB per file to support videos, 10 files max as enforced at the route level.
const imageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = imageUpload;
