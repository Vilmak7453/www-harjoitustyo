"use strict";
var express = require("express");
var app = express();
var server = require("http").Server(app);
var path = require("path");
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var errorHandler = require('errorhandler');

var gameRouter = require('./scripts/routes/gameRouter');
var userRouter = require('./scripts/routes/userRouter');
var profileRouter = require('./scripts/routes/profileRouter');
var friendshipRouter = require('./scripts/routes/friendshipRouter');
var chatRouter = require('./scripts/routes/chatRouter');
require('./config/passport');

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));
app.use(session({
	secret: 'passport',
	cookie: { maxAge: 6000000 },
	resave: false,
	saveUninitialized: false
}));

//Set mongoose connection
var mongoose = require('mongoose');
//var mongoDB = 'mongodb://mongo:27017/localLibrary';
var mongoDB = 'mongodb://192.168.99.100:27017/localLibrary';
mongoose.connect(mongoDB);
mongoose.set('debug',true);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/dist/views"));

app.get('/', (req, res, next) => {

  res.redirect('/user');
});

app.use('/game', gameRouter);
app.use('/user', userRouter);
app.use('/profile', profileRouter);
app.use('/friend', friendshipRouter);
app.use('/chat', chatRouter);

if(!isProduction) {
  app.use((err, req, res, next) => {

    if(err.name === 'UnauthorizedError') {
      console.log(err.message);
      res.redirect('/user/login');
    }

    res.status(err.status || 500);
    console.log(err);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res, next) => {

  if(err.name === 'UnauthorizedError') {
    console.log(err.message);
    res.redirect('/user/login');
  }

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

module.exports = server;