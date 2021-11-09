const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const session = require('express-session');

require('./auth')(passport);

function authenticationMiddleware(req, res, next) {
  if(req.isAuthenticated()) return next();
    res.redirect('/login');
}


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/loginRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// authentication inicio
app.use(session({
  secret : '123',
  resave : false,
  saveUninitialized : false,
  cookie: {maxAge: 2 * 60 *1000} //2 minutos
}));
app.use(passport.initialize());
app.use(passport.session());

//fim

app.use('/login', loginRouter);
app.use('/users', authenticationMiddleware ,usersRouter);
app.use('/', authenticationMiddleware, indexRouter);

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
