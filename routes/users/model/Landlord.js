const mongoose = require('mongoose');

const landlordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Add more landlord details as needed
});

const Landlord = mongoose.model('Landlord', landlordSchema);

module.exports = Landlord;
