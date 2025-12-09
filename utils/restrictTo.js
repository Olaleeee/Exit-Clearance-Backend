const catchAsync = require('./catchAsync');

module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: 'You do not have permission',
    });
  }

  next();
};
