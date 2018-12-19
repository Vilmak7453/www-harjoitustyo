"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var statisticsController = require('../controllers/statisticsController');
var userController = require('../controllers/userController');

router.get("/", auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			res.render('statistics', {title: 'Tilastot', user: user});
		});
	else
		res.render('statistics', {title: 'Tilastot'});
});

router.get('/worldSum', statisticsController.worldSum);

router.get("/friendSum", auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			statisticsController.friendSum(req, res, next);
		});
	else
		res.send({empty: false});
});

router.get('/worldAvgWeather', statisticsController.worldAvgWeather);

router.get("/friendAvgWeather", auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			statisticsController.friendAvgWeather(req, res, next);
		});
	else
		res.send({empty: false});
});

module.exports = router;