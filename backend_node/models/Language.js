const mongoose = require('mongoose');

const Language = mongoose.model(
  'languages',
  new mongoose.Schema({
    data: [
      {
        year: {
          type: Number,
          required: true
        },
        Java: {
          type: Number,
          default: 0
        },
        Python: {
          type: Number,
          default: 0
        },
        C: {
          type: Number,
          default: 0
        },
        Javascript: {
          type: Number,
          default: 0
        },
        Go: {
          type: Number,
          default: 0
        },
        Ruby: {
          type: Number,
          default: 0
        },
        R: {
          type: Number,
          default: 0
        },
        Swift: {
          type: Number,
          default: 0
        },
        Kotlin: {
          type: Number,
          default: 0
        },
        PHP: {
          type: Number,
          default: 0
        },
        Typescript: {
          type: Number,
          default: 0
        },
        HTML: {
          type: Number,
          default: 0
        }
      }
    ]
  })
);

module.exports = Language;
