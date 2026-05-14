const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'available' },
  image: { type: String, default: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.pngaaa.com%2F13%2F1887013-middle.png&f=1&nofb=1&ipt=5a6c1f59a6279ddcf7f64068397c3445e976526a16131363e2a28b135b691541' }
});

module.exports = mongoose.model('Court', courtSchema);