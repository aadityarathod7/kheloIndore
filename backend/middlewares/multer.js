const multer = require("multer");

// Define a function to determine destination dynamically
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.query.types ; // Default to 'default' if type is not provided
    console.log(type,"typetype")
    cb(null, `public/uploads/${type}`);
  },
  filename: function (req, file, cb) {
    let extension = "";
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extension = "docx";
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      extension = "xlsx";
    } else if (file.mimetype === "text/plain") {
      extension = "txt";
    } else if (file.mimetype === "image/jpeg") {
      extension = "jpg";
    } else {
      const extArray = file.mimetype.split("/");
      extension = extArray[extArray.length - 1];
    }
    cb(null, `${Date.now()}.${extension}`);
  },
});

const imageUpload = multer({ storage: storage });

module.exports = imageUpload;
