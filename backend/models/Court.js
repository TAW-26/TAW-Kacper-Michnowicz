const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'available' }
});

module.exports = mongoose.model('Court', courtSchema);