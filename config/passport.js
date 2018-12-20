"use strict";
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

//email is fetched from req.body.email and password from req.body.password
passport.use(new LocalStrategy({
  	usernameField: 'email',
  	passwordField: 'password',
	}, 
	(email, password, done) => {
		//User can log in based either on email or username
	  	User.findOne({$or:[{email: email },{name: email }]}, function (err, user) {
		    if (err) { return done(err, false, null); }
		    if (!user) { return done(null, false, 'Käyttäjää ei löytynyt. Tarkista sähköpostisi/käyttäjätunnuksesi!'); }
		    if (!user.validatePassword(password)) { return done(null, false, 'Salasana ei ole oikein'); }
		    return done(null, user, null);
		});
  	}
));