const mongoose = require('mongoose');

const User = mongoose.model(
  'popularusers',
  new mongoose.Schema({
    data: {
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        default: 0
      },
      followers: {
        type: Number,
        default: 0
      }
    }
  })
);

module.exports = User;
