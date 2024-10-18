const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const authenticateJWT = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/contacts", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  "/contacts",
  (req, res, next) => {
    req.io = req.app.get("io");
    next();
  },
  authenticateJWT,
  contactRoutes
);
app.use("/user", userRoutes);

module.exports = app;
