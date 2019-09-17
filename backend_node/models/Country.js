const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const countrySchema = new Schema({
    country: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Country', countrySchema);
