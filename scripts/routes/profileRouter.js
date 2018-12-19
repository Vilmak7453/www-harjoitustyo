"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var userController = require('../controllers/userController');
var scoreController = require('../controllers/scoreController');

router.get('/', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			res.render('profilePage', {title: "Profiili", user: user});
		});
});

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

router.get('/updateProfile', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			res.render('updateProfile', {title: "Muokkaa profiilia", user: user, name: user.name, email: user.email, apikey: user.apikey });
		});
	else
		res.redirect('/user/login');
});

router.post('/updateProfile', auth.required, userController.updateProfile);

router.get('/getUsersScores', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			scoreController.getUsersScores(req, res, next);
		});
	else
		res.redirect('/user/login');
});

router.get('/getUsernameEmailPoints', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			scoreController.getUsernameEmailPoints(req, res, next);
		});
	else
		res.redirect('/user/login');
});

module.exports = router;