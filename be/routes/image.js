const express = require("express");
const Capture = require("../models/Capture");
const imageRouter = express.Router();

const { authenticateToken } = require("./login");
console.log(authenticateToken);
// Endpoint to save image URL and metadata to MongoDB
imageRouter.post(
    "/upload",
    authenticateToken,
    async (req, res) => {
        const { latitude, longitude, zoom, imageUrl } = req.body;

        const capture = new Capture({
            userId: req.user.id,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            zoom: parseInt(zoom),
            imageUrl,
        });

        try {
            await capture.save();
            res.status(200).json({ message: "Capture saved successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error saving capture", error });
        }
    }
);

// Endpoint to get all captures for the logged-in user
imageRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const captures = await Capture.find({ userId: req.user.id });
        res.status(200).json(captures);
    } catch (error) {
        res.status(500).json({ message: "Error fetching captures", error });
    }
});

// Endpoint to get a single capture by ID for the logged-in user
imageRouter.get("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const capture = await Capture.findOne({ _id: id, userId: req.user.id });
        if (!capture) {
            return res.status(404).json({ message: "Capture not found" });
        }
        res.status(200).json(capture);
    } catch (error) {
        res.status(500).json({ message: "Error fetching capture", error });
    }
});

module.exports = imageRouter;
