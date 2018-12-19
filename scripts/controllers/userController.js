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
        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
          if(err) {
            console.log(err);
          }
          if(passportUser) {
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
      var authUser = this.current(req, res, next);
      if(authUser !== null)
        authUser.then(function(user) {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values/errors messages.
              res.render('updateProfile', { title: 'Muokkaa profiilia', user: user, email: req.body.email, name: req.body.name, errors: errors.array()});
              return;
          }
          else {
            var newEmail = req.body.email;
            req.body.password = req.body.oldPassword;
            req.body.email = user.email;

            return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
              if(err) {
                console.log(err);
              }
              if(passportUser) {
                passportUser.email = newEmail;
                passportUser.name = req.body.name;
                if(req.body.password1 !== "") {
                  passportUser.setPassword(req.body.password1);
                }
                User.findByIdAndUpdate(passportUser._id, passportUser, {}, function(err, theUser) {
                  if(err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                      var error = {msg: "Sähköposti tai käyttäjätunnus on jo käytössä!"};
                      res.render('updateProfile', {title: "Muokkaa profiilia", user: user, email: newEmail, name: req.body.name, errors: [error]}); 
                      return;
                    }
                    return next(err);
                  }
                  res.redirect("/profile");
                });
                return;
              }
              var error = {msg: info};
              res.render('updateProfile', {title: "Muokkaa profiilia", user: user, email: newEmail, name: req.body.name, errors: [error]});
              return;
            })(req, res, next);
          }
        });
      else
        res.redirect('/user/login');
    }
];

exports.visitProfile = function(req, res, next) {

  var visitUserID = req.params.id;
  console.log(visitUserID);

  User
  .findById(visitUserID)
  .then((visitUser) => {
    Score
    .aggregate([{
      $match: {
        user: visitUser._id
      }
    },{
      $group: {
        _id: null,
        averageValue: {$avg: "$value"},
        averageTemperature: {$avg: "$temperature"},
        maxValue: {$max: "$value"},
        minTemperature: {$min: "$temperature"},
        maxTemperature: {$max: "$temperature"},
        count: {$sum: 1}
      }
    }])
    .exec(function(err, list_stats) {
        if (err) { console.log(err); return next(err); }

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