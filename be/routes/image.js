const express = require('express');
const multer = require('multer');
const Capture = require('../models/Image');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    const { region, userId } = req.body;
    const image = req.file.path;

    try {
        const newCapture = new Capture({ image, region, userId });
        await newCapture.save();
        res.status(201).json(newCapture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const captures = await Capture.find();
        res.status(200).json(captures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Additional endpoints for analytics, caching, and state management can be added here.

module.exports = router;