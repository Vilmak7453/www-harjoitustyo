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
			res.render('searchFriends', {title: "Etsi käyttäjiä", user: user});
		});
	else
		res.redirect("/user/login");
});

router.get('/friendOverview', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			res.render('friendOverview', {title: "Kaverisi", user: user});
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

router.post('/sendFriendRequest', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			req.body.user = user;
			friendshipController.sendFriendRequest(req, res, next);
		});
	else
		res.redirect("/user/login");
});

router.get('/getFriendRequests', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			req.body.user = user;
			friendshipController.getFriendRequests(req, res, next);
		});
	else
		res.redirect("/user/login");
});

router.post('/acceptFriend', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			req.body.user = user;
			friendshipController.acceptFriend(req, res, next);
		});
	else
		res.redirect("/user/login");
});

router.get('/getFriends', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then((user) => { 
			req.body.user = user;
			friendshipController.getFriends(req, res, next);
		});
	else
		res.redirect("/user/login");
});

module.exports = router;