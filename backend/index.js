const express = require ("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

const dbConnect = require("./config/database");
dbConnect();
const bookingCron = require("./middlewares/cron_approval_email");
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/pdf", express.static(path.join(__dirname, "public/pdf")));

app.use(cors());
app.use(express.json());
app.use("/admin", express.static(path.join(__dirname, "public/admin/build/")));
app.use("/", express.static(path.join(__dirname, "public/site/build/")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Import routes
const mainRoute = require("./routes/AllRoutes");
app.use("/api", mainRoute);

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/build", "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/site/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
