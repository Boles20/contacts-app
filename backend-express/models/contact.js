const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  notes: { type: String },
  locked: { type: Boolean, default: false },
  lockedBy: { type: String, default: null },
});

module.exports = mongoose.model("Contact", contactSchema);
