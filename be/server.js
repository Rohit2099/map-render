const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI);

const Capture = require("./models/Capture");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to save image URL and metadata to MongoDB
app.post("/api/captures/upload", async (req, res) => {
    const { latitude, longitude, zoom, imagePath } = req.body;
    const capture = new Capture({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        zoom: parseInt(zoom),
        imagePath,
    });
    console.log("in api");

    try {
        await capture.save().then((savedDoc) => {
            console.log(savedDoc);
        });
        res.status(200).json({ message: "Capture saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving capture", error });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
