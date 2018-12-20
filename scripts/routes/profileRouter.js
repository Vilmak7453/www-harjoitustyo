"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var userController = require('../controllers/userController');
var scoreController = require('../controllers/scoreController');

router.get('/', function(req, res, next) {

	res.redirect('/profile/auth');
});

//General path for authentication in profile paths
router.use('/auth', auth.required, function(req, res, next) {

	//get promise if user is logged in and authorized
	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			next();
		});
	else
		res.redirect('/user/login');
});

router.get('/auth', function(req, res, next) {

	res.render('profilePage', {title: "Profiili", user: req.body.user});
});

//Get user's highscore
router.get('/getHighscore', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			scoreController.getHighscoreByUser(req, res, next);
		})
	else
		res.send({score: 0});
});

router.get('/auth/updateProfile', function(req, res, next) {
	
	res.render('updateProfile', {title: "Muokkaa profiilia", user: req.body.user, name: req.body.user.name, email: req.body.user.email });
});

router.post('/auth/updateProfile', userController.updateProfile);

//Get user's 20 best scores
router.get('/auth/getUsersScores', scoreController.getUsersScores);

//Get user's name, email and scores for generating PDF
router.get('/auth/getUsernameEmailPoints', scoreController.getUsernameEmailPoints);

//Visit another user's profile
router.get('/visit/:id', auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			userController.visitProfile(req, res, next);
		});
	else {
		req.body = [];
		userController.visitProfile(req, res, next);
	}
});

module.exports = router;