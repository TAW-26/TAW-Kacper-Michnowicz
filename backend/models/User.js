const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  reservations: [
      {
        courtId: { type: String, required: true },
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        bookedAt: { type: Date, default: Date.now }
      }
    ]
});
module.exports = mongoose.model('User', userSchema);