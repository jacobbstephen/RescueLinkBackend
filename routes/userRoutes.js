const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const { body, validationResult } = require("express-validator");

const userModel = require("../models/userModel");
// api for registering user
router.post(
  "/register",
  body("email").trim().isEmail().withMessage("Invalid email format").isLength({ min: 11 }).withMessage("Email must be at least 11 characters long"),
  body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phoneNo").trim().isNumeric().withMessage("Phone number must contain only digits").isLength({ min: 10 }).withMessage("Phone number must be at least 10 digits long"),
  body("name").trim().matches(/^[A-Za-z\s]+$/).withMessage("Name can only contain alphabets and spaces").isLength({ min: 1 }).withMessage("Name is required"),
  body("latitude").isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
  body("longitude").isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid data",
      });
    }

    try {
      const { name, email, password, phoneNo, latitude, longitude } = req.body;

      // missing detials check for geographic detials
      if (!latitude || !longitude) {
        return res.status(400).json({
          message: "Missing geographic details (latitude, longitude)",
        });
      }
      // existing user check
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User is already registered with this email",
        });
      }
      // convert user
      const hashPassword = await bcrypt.hash(password, 10);

      // add new user to DB
      const newUser = await userModel.create({
        name,
        email,
        password: hashPassword,
        phoneNo,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
      });
      // return status code
      res.status(201).json({
        message: "User registered Succesfully",
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
// api for login
router.post(
  "/login",
  body("password").trim().isLength({ min: 6 }),
  body("email").trim().isEmail().withMessage("Invalid email format").isLength({ min: 11 }).withMessage("Email must be at least 11 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid data",
      });
    }

    try {
      const { email, password } = req.body;
        // Check if user exists
      const user = await userModel.findOne({
        email,
      });
      if (!user) {
        return res.status(400).json({
          message: "Phone no or password is incorrect",
        });
      }
      // compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Phone no or password is incorrect",
        });
      }
    // Create a token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          name: user.name,
          phoneNo: user.phoneNo,
        },
        process.env.JWT_SECRET_KEY
      );

      res.status(200).json({
        token,
        message: "User logged in Successfully",
      });
    } catch (error) {
      console.error("Error during user Login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
