const mongoose = require('mongoose');

const captureSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: Number,
    longitude: Number,
    zoom: Number,
    imageUrl: String,
});

module.exports = mongoose.model('Capture', captureSchema);