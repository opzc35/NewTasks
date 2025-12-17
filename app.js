var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { initDB } = require('./lib/lib_db.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database synchronously
let db;
initDB().then(database => {
  db = database;
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Setup routes with lazy database access
app.use('/', function(req, res, next) {
  if (!db) {
    return res.status(503).send('Database not ready');
  }
  indexRouter(db)(req, res, next);
});

app.use('/users', function(req, res, next) {
  if (!db) {
    return res.status(503).send('Database not ready');
  }
  usersRouter(db)(req, res, next);
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
