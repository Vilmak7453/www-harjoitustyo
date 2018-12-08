"use strict";
var passport = require('passport');
var { body,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

var User = require('../models/user');

exports.register = [

    // Validate fields.
    body('name').trim().isLength({min: 1, max: 20}).withMessage('Käyttäjätunnuksen on oltava 1-20 merkkiä pitkä.'),
    body('email').isEmail().normalizeEmail().withMessage('Osoite ei ole oikeassa muodossa'),
    body('password1').trim().isLength({ min: 1, max: 20 }).withMessage('Salasana on pakollinen. 1-20 merkkiä.'),
    body('password2').trim().custom((value, {req, loc, path})=>{
      if(value !== req.body.password1)
        throw new Error("Salasanat eivät ole samat");
      else
        return value;}).withMessage("Salasanat eivät ole samat"),

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
                    return res.render('register', { title: 'Luo uusi käyttäjä', email: req.body.email, name: req.body.name, errors: [error] }); 
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