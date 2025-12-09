const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  let value;
  console.log(err.errors.form);
  if (err.errors.form)
    value = Object.values(err.errors.form.errors)
      .map((el) => el.message)
      .join(' | ');
  else value = Object.values(err.errors).join('. ');

  const message = `${value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const [key, val] = JSON.parse(
    JSON.stringify(Object.entries(err.keyValue)),
  ).flat(2);
  return new AppError(`${key} "${val}" already exist`, 400);
};

const handleJWTError = (err) => {
  const message = err.message;
  return new AppError(`sign in to continue this action`, 401);
};

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    stack: err.stack,
    message: err.message,
    error: err,
  });
};

const sendErrorProd = (res, err) => {
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
    });
  else
    res.status(500).json({
      status: 'error',
      message: 'something went wrong...😔',
    });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(res, err);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    console.log(err);

    console.log(err.name);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    else if (err.name === 'ValidationError')
      error = handleValidationErrorDB(err);
    else if (err.name === 'CastError') error = handleCastErrorDB(err);
    else if (err.name === 'JsonWebTokenError') error = handleJWTError(err);

    sendErrorProd(res, error);
  }
};
