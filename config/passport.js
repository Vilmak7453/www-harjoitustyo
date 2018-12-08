"use strict";
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

passport.use(new LocalStrategy({
  	usernameField: 'email',
  	passwordField: 'password',
	}, 
	(email, password, done) => {
	  	User.findOne({$or:[{email: email },{name: email }]}, function (err, user) {
		    if (err) { return done(err, false, null); }
		    if (!user) { return done(null, false, 'Käyttäjää ei löytyny. Tarkista sähköpostisi/käyttäjätunnuksesi!'); }
		    if (!user.validatePassword(password)) { return done(null, false, 'Salasana ei ole oikein'); }
		    return done(null, user, null);
		});
  	}
));