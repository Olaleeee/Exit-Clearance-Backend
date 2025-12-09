const mongoose = require('mongoose');
const formSchema = require('./formModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: [
      function (el) {
        return el === this.password;
      },
      'password do not match',
    ],
  },
  number: {
    type: String,
    required: [true, 'Please provide your Phone Number'],
    unique: true,
    validate: [
      validator.isMobilePhone,
      'Input a valid number please',
    ],
  },
  role: {
    type: String,
    required: [true, 'Please select a role'],
    lowercase: true,
  },
  form: {
    type: formSchema,
    default: undefined,
    _id: false,
    sparse: true,
  },
  allowFormSubmitIn: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = (
  candidatePassword,
  userPassword
) => bcrypt.compare(candidatePassword, userPassword);

const User = mongoose.model('User', userSchema);

module.exports = User;
