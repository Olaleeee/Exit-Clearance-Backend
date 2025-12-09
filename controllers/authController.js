const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
console.log(process.env.JWT_SECRET_KEY);
const signToken = (id, role) =>
  jwt.sign({ id, role: role || '' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    number: req.body.number,
    role: req.body.role,
  });

  const token = signToken(newUser._id, newUser.role);

  res.status(200).json({
    status: 'success',
    // data: {
    //   token,
    // },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password)
    return next(new AppError('please provide an email and password', 400));

  const user = await User.findOne({ email, role }).select('+password +role');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('incorrect email or password', 401));

  const token = signToken(user._id, user.role);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});
