const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'available' },
  image: { type: String, default: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fpng-vector%2F20220119%2Fourmid%2Fpngtree-crossed-image-icon-picture-not-available-sign-photo-sign-icon-vector-png-image_44027862.jpg&f=1&nofb=1&ipt=1baba5273ccbb01b91b9e4a0f70d4e09b4e36af51ff822f1dfb3d157e40a7a46' }
});

module.exports = mongoose.model('Court', courtSchema);