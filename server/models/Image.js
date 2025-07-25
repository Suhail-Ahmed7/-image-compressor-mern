const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  originalName: String,
  compressedName: String,
  originalSize: Number,
  compressedSize: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
