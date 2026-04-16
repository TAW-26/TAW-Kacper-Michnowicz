const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  userId: { type: String, default: 'current-user' }
});

module.exports = mongoose.model('Reservation', reservationSchema);