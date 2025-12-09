const User = require('../models/userModel');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');
const jwt = require('jsonwebtoken');

module.exports = catchAsync(async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) return next(new AppError('You are not signed in yet', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError(`User no longer doesn't exist`));

  req.user = user;
  next();
});
