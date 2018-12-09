"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var friendshipController = require('../controllers/friendshipController');
var userController = require('../controllers/userController');

router.get("/", auth.required, function(res, req, next) {

	res.redirect("/friend/searchFriends");
});

router.get('/searchFriends', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			res.render('searchFriends', {title: "Etsi kavereita", user: user});
		});
	else
		res.redirect("/user/login");
});

router.get('/searchFriendsWithName', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			req.body.user = user;
			friendshipController.searchFriendsWithName(req, res, next);
		});
	else
		res.redirect("/user/login");
});

module.exports = router;