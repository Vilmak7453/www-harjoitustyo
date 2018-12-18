"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var scoreController = require('../controllers/scoreController');
var userController = require('../controllers/userController');

router.get("/", auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			res.render("game", {title: "Peli", user: user});
		});
	else
		res.render("game", {title: "Peli"});
});

router.post("/saveScore", auth.optional, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			scoreController.score_save(req, res, next);
		});
	else
		scoreController.score_save(req, res, next);
	res.redirect("/game");

});

router.get("/scoreboard", auth.optional, function(req, res, next) {
	var authUser = userController.current(req, res, next);
	if(authUser !== null) 
		authUser.then((user) => { 
			req.body.user = user;
			scoreController.score_list(req, res, next);
		});
	else
		scoreController.score_list(req, res, next);
});

router.get("/removeAllScores", function(req, res, next) {
	
	scoreController.remove_all_scores();
	res.redirect("/game/scoreboard");
});


module.exports = router;