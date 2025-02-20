const express = require("express");
const router = express.Router();

const volunteerModel = require("../models/volunterModel");

router.post("/register", async (req, res) => {
  try {
    const { name, phoneNumber, location } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "No Name found ",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        message: "No phone number found ",
      });
    }
    if(!location){
        return res.status(400).json({
            message: " Location not found ",
          });
    }

    const existingVolunteer = await volunteerModel.findOne({name});
    if(existingVolunteer){
        return res.status(400).json({
            message: " Volunteer exists already ",
          });
    }
    await volunteerModel.create({
      name,
      phoneNumber,
      location,
      
    });

    return res.status(200).json({
      message: "Volunteer registered Successfully",
    });
  } catch (err) {
    console.log("Error = ", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// route for deleting volunteer

router.post("/delete", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "No Name found ",
      });
    }
    const volunteer = await volunteerModel.findOne({ name });
    if (!volunteer) {
      return res.status(400).json({
        message: "Volunteer does not exist ",
      });
    }
    await volunteerModel.deleteOne({ name });

    res.status(200).json({
      message: "Volunteer deleted",
    });
  } catch {
    console.log("Error = ", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// route for getting volunteers in nearby location

router.get("/getNearbyVolunteers", async (req, res) => {
    try {
      // get userlocation using query
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Coordinates are missing, INternal server error",
      });
    }

    const referenceLocation = [parseFloat(longitude), parseFloat(latitude)];

    const nearByVolunteers = await volunteerModel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: referenceLocation },
          $maxDistance: 10000,// in meters
        },
      },
    });

    return res.status(200).json({
      message: "Volunteers retrieved Successfully",
      nearByVolunteers,
    });
  } catch(err) {
    console.log("Error = ", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
