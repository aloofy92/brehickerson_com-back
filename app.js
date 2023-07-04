var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
const Review = require('./routes/users/model/Review');







mongoose.connect(process.env.MONGODB_URI, { dbName: 'Capstone-Project-1' })
  .then(() => console.log('MongoDB Connected!!!'))
  .catch((error) => console.log(error));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// Handle form submission
app.post('/api/reviews', async (req, res, next) => {
  try {
    const { name, rating, description, propertyDetails, leaseDuration, depositReturn } = req.body;

    // Create a new review document
    const newReview = new Review({
      name,
      rating,
      description,
      propertyDetails,
      leaseDuration,
      depositReturn
    });

    // Save the new review to the database
    await newReview.save();

    res.status(201).json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
