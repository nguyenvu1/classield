var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var logger = require('morgan');
var expHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var settings = require('./config/settings');
var database = require('./config/database');
var index = require('./routes/index');
var routerMember = require('./routes/member');

var app = express();
var validator = require('express-validator');
mongoose.connect(database.dbStr);
mongoose.connection.on('error', function(err){
	console.log('Error connect to Database: ' + err);
});
require('./config/passport')
// view engine setup
var hbsConfig = expHbs.create({
	helpers: require('./helpers/handlebars.js').helpers,
  layoutsDir: path.join(__dirname, '/templates/' + settings.defaultTemplate + '/layouts'),
  defaultLayout: path.join(__dirname, 'templates/' + settings.defaultTemplate + '/layouts/layout'),
	partialsDir: path.join(__dirname, '/templates/' + settings.defaultTemplate + '/partials'),
	extname: '.hbs'
});

app.engine('.hbs', hbsConfig.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'templates/' + settings.defaultTemplate));

app.use(logger('dev'));
app.use(validator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
i18n.configure({
  locales: ['vi', 'en'],
  register: global,
  fallbacks: {'en':'vi'},
  cookie: 'language', // name of cookie in brower
  queryParameter: 'lang', // param in url to change the language
  defaultLocale: 'en',
  directory: __dirname + '/languages',
  directoryPermissions: '755', // Thiết lập quyền ghi cho các file ngôn ngữ
  autoReload: true,
  updateFiles: true,
  api: {
    '__': "__",
    '__n': '__n'
  }
});


app.use(session({
  secret: settings.secured_key,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  i18n.init(req, res, next);
});

app.use(function(req, res, next){
  res.locals.clanguage = req.getLocale(); // Ngôn ngữ hiện tại
  res.locals.languages = i18n.getLocales(); // Danh sách khai báo trong phần cấu hình
  res.locals.settings = settings;
  next();
});


app.use('/', index);
app.use('/thanh-vien', routerMember);

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
