"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var userController = require('../controllers/userController');
var chatController = require('../controllers/chatController');

router.get("/", function(req, res, next) {

	res.redirect("/chat/auth");
});

//General path for authentication in chat paths
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

router.get('/auth', function(req, res, next) {

	res.render('chat', {title: "Keskustelut", user: req.body.user});
});

//Fetch user's conversations/groups
router.get('/auth/getConversations', chatController.getConversations);

router.get('/auth/createConversation', chatController.renderConversation);

router.post('/auth/createConversation', chatController.createConversation);

router.post('/auth/sendMessage', chatController.sendMessage);

//Get messages for picked conversation
router.get('/auth/getMessages', chatController.getMessages);

//Get current user's username
router.get('/auth/getCurrentUsername', function(req, res, next) {

	res.send({username: req.body.user.name});
});

module.exports = router;