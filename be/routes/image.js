const express = require("express");
const Capture = require("../models/Capture");
const imageRouter = express.Router();

const { authenticateToken } = require("./login");
const User = require("../models/User");
console.log(authenticateToken);

imageRouter.post("/upload", authenticateToken, async (req, res) => {
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
});

imageRouter.get('/top3', async (req, res) => {
    try {
      const topRegions = await Capture.aggregate([
        {
          $group: {
            _id: { latitude: '$latitude', longitude: '$longitude', zoom: '$zoom' },
            count: { $sum: 1 },
            imageUrl: { $first: '$imageUrl' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 3 },
        {
          $project: {
            _id: 0,
            latitude: '$_id.latitude',
            longitude: '$_id.longitude',
            zoom: '$_id.zoom',
            count: 1,
            imageUrl: 1
          }
        }
      ]);
  
      res.json(topRegions);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Unable to get top 3');
    }
  });

// // Endpoint to get a single capture by ID for the logged-in user
// imageRouter.get("/:id", authenticateToken, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const capture = await Capture.findOne({ _id: id, userId: req.user.id });
//         if (!capture) {
//             return res.status(404).json({ message: "Capture not found" });
//         }
//         res.status(200).json(capture);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching capture", error });
//     }
// });

imageRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const captures = await Capture.find({ userId: req.user.id });
        res.status(200).json(captures);
    } catch (error) {
        res.status(500).json({ message: "Error fetching captures", error });
    }
});


module.exports = imageRouter;
