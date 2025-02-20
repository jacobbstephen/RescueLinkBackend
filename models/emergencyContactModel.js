const mongoose = require("mongoose");

const emergencyContactsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is required"],
  },
  contacts: [
    {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
  ],
});

const emergencyContacts = mongoose.model(
  "emergencyContacts",
  emergencyContactsSchema
);
module.exports = emergencyContacts;
