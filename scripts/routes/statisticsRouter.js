"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var statisticsController = require('../controllers/statisticsController');
var userController = require('../controllers/userController');

//General path for authentication in statistics paths
router.use("/auth", auth.required, function(req, res, next) {

	//get promise if user is logged in and authorized
	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			next();
		});
	else
		res.redirect("/user/login");
});

//General path for optional authentication
router.use("/authOp", auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			next();
		});
	else
		res.send({empty: false});
});

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

//Get statistics for scores' counts from whole user base
router.get('/worldSum', statisticsController.worldSum);


//Get statistics for scores' counts from user's friends including themselves
router.get("/authOp/friendSum", statisticsController.friendSum);

//Get average scores for temperatures from whole user base
router.get('/worldAvgWeather', statisticsController.worldAvgWeather);

//Get average scores for temperatures from user's friends including themselves
router.get("/authOp/friendAvgWeather", statisticsController.friendAvgWeather);

//Get user's own statistics for example highest score, count of played game and lowest temperature
router.get("/auth/getUserStatistics", statisticsController.userStatistics);

module.exports = router;