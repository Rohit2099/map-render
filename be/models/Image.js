const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image: { type: String, required: true },
    region: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);