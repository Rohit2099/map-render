const mongoose = require('mongoose');

const captureSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    zoom: Number,
    imagePath: String,
});

module.exports = mongoose.model('Capture', captureSchema);