"use strict";
var passport = require('passport');
var { body,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

var User = require('../models/user');
var Score = require('../models/score');

var statisticsController = require('../controllers/statisticsController');
var scoreController = require('../controllers/scoreController');

exports.register = [

    // Validate fields.
    body('name').trim().isLength({min: 1, max: 20}).withMessage('Käyttäjätunnuksen on oltava 1-20 merkkiä pitkä.'),
    body('email').isEmail().normalizeEmail().withMessage('Osoite ei ole oikeassa muodossa'),
    body('password1').trim().isLength({ min: 1, max: 20 }).withMessage('Salasana on pakollinen. 1-20 merkkiä.'),
    body('password2').trim().custom((value, {req, loc, path})=>{
      if(value !== req.body.password1)
        throw new Error("Salasanat eivät ole samat");
      else
        return value;
    }).withMessage("Salasanat eivät ole samat"),

    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    sanitizeBody('name').trim().escape(),
    sanitizeBody('password1').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('register', { title: 'Luo uusi käyttäjä', email: req.body.email, name: req.body.name, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            var user = new User(
                {
                  name: req.body.name,
                  email: req.body.email
                });

            //Sets password in hashed form
            user.setPassword(req.body.password1);

            user.save(function (err) {
                if (err) { 
                  if (err.name === 'MongoError' && err.code === 11000) {
                    var error = {msg: "Sähköposti tai käyttäjätunnus on jo käytössä!"};
                    return res.render('register', { title: 'Luo uusi käyttäjä', email: req.body.email, name: req.body.name, errors: [error]}); 
                  }
                  return next(err);
                }

                var value = "Token " + user.generateJWT();
                req.session.authorization = value;
                res.redirect("/game");
            });
        }
    }
];

exports.login = [

    // Validate fields.
    body('password').isLength({ min: 1, max: 20 }).trim().withMessage('Salasana on pakollinen. 1-20 merkkiä.'),
    
    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    sanitizeBody('password').trim().escape(),

    (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render('login', { title: 'Luo uusi käyttäjä', email: req.body.email , errors: errors.array() });
      }
      else {
        //Authenticate the password. Takes password from req.body.password and email from req.body.email
        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
          if(err) {
            console.log(err);
            next(err);
          }
          if(passportUser) {
            //Generate jsonwebtoken and store it in session where it can be used for authentication
            //Token must be saved in form "Token odsif3249skfd"
            var value = "Token " + passportUser.generateJWT();
            req.session.authorization = value;
            res.redirect("/game");
            return;
          }
          var error = {msg: info};
          res.render('login', {title: "Kirjaudu sisään", email: req.body.email, errors: [error]});
        })(req, res, next);
      }
    }
];

//Returns promise for receiving currently logged user
exports.current = function(req, res, next) {

  if(req.payload === undefined)
    return null;

  const { payload: { id } } = req;

  return User.findById(id)
    .then((user) => {
      if(!user) {
        return null;
      }
      return user;
    });
};

exports.updateProfile = [

    // Validate fields.
    body('name').trim().isLength({min: 1, max: 20}).withMessage('Käyttäjätunnuksen on oltava 1-20 merkkiä pitkä.'),
    body('email').isEmail().normalizeEmail().withMessage('Osoite ei ole oikeassa muodossa'),
    body('password1').trim().isLength({ max: 20 }).withMessage('Uuden salasanan oltava 1-20 merkkiä.'),
    body('password2').trim().custom((value, {req, loc, path})=>{
      if(value === "" && req.body.password1 === "")
        return 1;
      else if(value !== req.body.password1)
        throw new Error("Uudet salasanat eivät ole samat");
      else
        return value;
    }).withMessage("Uudet salasanat eivät ole samat"),
    body('oldPassword').trim().isLength({min:1, max:20}).withMessage('Vanha salasana on väärä'),

    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    sanitizeBody('name').trim().escape(),
    sanitizeBody('password1').trim().escape(),
    sanitizeBody('oldPassword').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render('updateProfile', { title: 'Muokkaa profiilia', user: req.body.user, email: req.body.email, name: req.body.name, errors: errors.array()});
          return;
      }
      else {
        var newEmail = req.body.email;
        req.body.password = req.body.oldPassword;
        //Use old email for authentication
        req.body.email = req.body.user.email;

        //Authenticate the password. Takes password from req.body.password and email from req.body.email
        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
          if(err) {
            console.log(err);
            next(err);
          }
          if(passportUser) {

            passportUser.email = newEmail;
            passportUser.name = req.body.name;
            if(req.body.password1 !== "") {
              //Sets password in hashed form
              passportUser.setPassword(req.body.password1);
            }

            User.findByIdAndUpdate(passportUser._id, passportUser, {}, function(err, theUser) {
              if(err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                  var error = {msg: "Sähköposti tai käyttäjätunnus on jo käytössä!"};
                  res.render('updateProfile', {title: "Muokkaa profiilia", user: req.body.user, email: newEmail, name: req.body.name, errors: [error]}); 
                  return;
                }
                return next(err);
              }
              res.redirect("/profile");
            });
            return;
          }
          var error = {msg: info};
          res.render('updateProfile', {title: "Muokkaa profiilia", user: req.body.user, email: newEmail, name: req.body.name, errors: [error]});
          return;
        })(req, res, next);
      }
    }
];

//Get data about user that is visited
exports.visitProfile = function(req, res, next) {

  var visitUserID = req.params.id;

  //find visited user
  User
  .findById(visitUserID)
  .then((visitUser) => {

    //Find and calculate visited user's statistics
    Score
    .aggregate([{
      $match: {
        user: visitUser._id
      }
    },{
      $group: {
        _id: null,
        averageValue: {$avg: "$value"}, //Average score
        averageTemperature: {$avg: "$temperature"}, //average temperature
        maxValue: {$max: "$value"}, //highscore
        minTemperature: {$min: "$temperature"}, //Lowest measured temperature
        maxTemperature: {$max: "$temperature"}, //Highest measured temperature
        count: {$sum: 1} //Played games
      }
    }])
    .exec(function(err, list_stats) {
        if (err) { console.log(err); return next(err); }

        //Save calculated values with relevant names
        var statList = [];
        statList.push({
          name: "Paras tulos",
          value: list_stats[0].maxValue
        });
        statList.push({
          name: "Pelatut pelit",
          value: list_stats[0].count
        });
        statList.push({
          name: "Tuloksien keskiarvo",
          value: Math.round(list_stats[0].averageValue)
        });
        statList.push({
          name: "Lämpötilojen keskiarvo",
          value: Number.parseFloat(list_stats[0].averageTemperature.toString()).toFixed(2)
        });
        statList.push({
          name: "Pienin lämpötila",
          value: list_stats[0].minTemperature.toString()
        });
        statList.push({
          name: "Korkein lämpötila",
          value: list_stats[0].maxTemperature.toString()
        });
        
        //Find visited user's 20 best scores
        Score
        .find({user: visitUser})
        .sort([["value", "descending"]])
        .limit(20)
        .exec(function (err, list_score) {
          if(err) { console.log(err); res.send(); }

          var scoreList = [];
          list_score.forEach(function(score) {
            scoreList.push({value: score.value,
                  date: score.date_formatted,
                  temperature: score.temperature.toString()});
          });
          res.render('visitProfilePage', {title: "Vierailulla", user: req.body.user, visitUser: visitUser, stat_list: statList, score_list: scoreList});
        });
    })
  })
}