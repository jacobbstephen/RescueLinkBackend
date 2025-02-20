const express = require("express");
const router = express.Router();

const incidentModel = require("../models/incidentReportingModel");
const authMiddleware = require("../middleware/auth");
const userModel = require('../models/userModel')

router.post("/report", authMiddleware, async (req, res) => {
  try {
    const {longitude, latitude, title, description} = req.body;
    const user = req.user
    

    if(!user.userId || !longitude || !latitude || !title || !description){
        return res.status(400).json({
            message: 'Missing Data'
        });
    }

``
    const incidentReport = await incidentModel.create({
        userId: user.userId,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          title,
          description

    });
    //  Logic for reteriving users within the radius of user reporting the incident

    const referenceLocation = [longitude, latitude];

        const nearbyUsers = await userModel.find({
            location: {
                $near: {
                    $geometry: {type: 'Point', coordinates: referenceLocation},
                    $maxDistance: 5000, // Distance in meters
                },
            },
        });

    

    res.status(200).json({
        nearbyUsers,
        message: 'Incident reported Successfully'
    })
  } catch (err) {
    console.error("Error during user reporting:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
