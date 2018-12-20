"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var friendshipController = require('../controllers/friendshipController');
var userController = require('../controllers/userController');

router.get("/", function(res, req, next) {

	res.redirect("/friend/auth/searchFriends");
});

//General path for authentication in friend paths
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

//Render search page
router.get('/auth/searchFriends', function(req, res, next) {

	res.render('searchFriends', {title: "Etsi käyttäjiä", user: req.body.user});
});

//Render page showing friend requests and friends
router.get('/auth/friendOverview',  function(req, res, next) {

	res.render('friendOverview', {title: "Kaverisi", user: req.body.user});
});

//Search new friends with part of their username
router.get('/auth/searchFriendsWithName', friendshipController.searchFriendsWithName);

router.post('/auth/sendFriendRequest', friendshipController.sendFriendRequest);

//Fetches friend requests that have been sent to user
router.get('/auth/getFriendRequests', friendshipController.getFriendRequests);

//Accept friend request
router.post('/auth/acceptFriend', friendshipController.acceptFriend);

//Fetch user's friends
router.get('/auth/getFriends', friendshipController.getFriends);

module.exports = router;