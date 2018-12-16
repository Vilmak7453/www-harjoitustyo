"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var userController = require('../controllers/userController');
var chatController = require('../controllers/chatController');

router.get('/', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			res.render('chat', {title: "Keskustelut", user: user});
		});
	else
		res.redirect('/user/login');
});

router.get('/getConversations', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			chatController.getConversations(req, res, next);
		});
	else
		res.redirect('/user/login');
});

router.get('/createConversation', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			chatController.renderConversation(req, res, next);
		});
	else
		res.redirect('/user/login');
});

router.post('/createConversation', auth.required, chatController.createConversation);

router.post('/sendMessage', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			chatController.sendMessage(req, res, next);
		});
	else
		res.redirect('/user/login');
});

router.get('/getMessages', auth.required, function(req, res, next) {

	var authUser = userController.current(req, res, next);
	if(authUser !== null)
		authUser.then(function(user) {
			req.body.user = user;
			chatController.getMessages(req, res, next);
		});
	else
		res.redirect('/user/login');
});

module.exports = router;