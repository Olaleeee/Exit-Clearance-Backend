const mongoose = require('mongoose');
const validator = require('validator');

const formSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your name'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
    sparse: true,
  },

  hostel: {
    type: String,
    required: [true, 'please fill the hostel field'],
  },

  roomNo: {
    type: Number,
    required: [true, 'please fill the Room No field'],
  },

  whoseRequest: {
    type: String,
    required: [true, 'please fill the Whose Request field'],
  },

  destination: {
    type: String,
    required: [true, 'please fill the Destination field'],
  },

  purpose: {
    type: String,
    required: [true, 'please fill the Purpose field'],
  },

  parentNo: {
    type: Number,
    required: [true, 'please fill the Parent No field'],
  },

  date: {
    type: String,
    required: [true, 'please fill the date field'],
  },

  status: {
    type: String,
    default: 'N/A',
  },

  reason: {
    type: String,
    default: '-',
  },

  locale: {
    type: String,
    default: 'en-US'
  }
});

module.exports = formSchema;

