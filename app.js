const cors = require('cors');
const express = require('express');
const app = express();

const morgan = require('morgan');
const userRouter = require('./routes/userRoute');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

app.use(morgan('dev'));

app.use(
  cors({
    origin: ['https://exit-clearance.vercel.app'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRouter);

app.use('/health', (req, res) => {
  res.status(200).end();
});

app.all('*', (req, res, next) => {
  next(new AppError(`can't find this url: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
