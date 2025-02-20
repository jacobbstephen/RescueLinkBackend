const mongoose = require("mongoose");
const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
volunteerSchema.index({ location: '2dsphere' });
const volunteerModel = mongoose.model("volunteer", volunteerSchema);
module.exports = volunteerModel;
