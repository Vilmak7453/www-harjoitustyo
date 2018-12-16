"use strict";
var Conversation = require("../models/conversation");
var Friendship = require('../models/friendship');
var Message = require("../models/message");

var userController = require('../controllers/userController');

var { sanitizeBody } = require('express-validator/filter');
var { body,validationResult } = require('express-validator/check');

exports.getConversations = function(req, res, next) {

	var user = req.body.user;
	Conversation
	.find({ 'users': user })
	.populate('users')
	.exec(function(err, list_conversations) {
		if(err) { console.log(err); res.send(); }

		res.send(list_conversations);
	});
}

exports.renderConversation = function(req, res, next) {

	var user = req.body.user;
	Friendship
	.find({$or:[{user1: user._id}, {user2: user._id}]})
	.where({accepted1: true, accepted2:true})
	.populate('user1 user2')
	.exec(function(err, list_friendships) {

		var list = [];
		list_friendships.forEach(function(friend) {
			var user1ID = friend.user1._id.toString();
			if(!user1ID.match(user._id))
				list.push(friend.user1);
			else
				list.push(friend.user2);
		});
		res.render('createConversation', {title: "Luo uusi keskustelu", user: user, friends: list});
	});
}

exports.createConversation = [
	
	body('groupName').trim().isLength({min: 1, max: 30}).withMessage('Nimen pitää olla 1-30 merkkiä pitkä!'),
	sanitizeBody('groupName').trim().escape(),

	(req, res, next) => {

		const errors = validationResult(req);

	    var authUser = userController.current(req, res, next);
		if(authUser !== null)
			authUser.then(function(user) {
		        if (!errors.isEmpty()) {

		            res.render('createConversation', { title: 'Luo uusi keskustelu', name: req.body.groupName, errors: errors.array(), user: user});	
		            return;
		        }
		        else {
					var conversation = new Conversation({
						groupName: req.body.groupName
					});
					var friends = [];
					console.log(req.body.groupers);
					if(Array.isArray(req.body.groupers))
						for(var i = 0; i < req.body.groupers.length; i++) {
							friends.push(req.body.groupers[i]);
						}
					else
						friends.push(req.body.groupers);
						friends.push(user);
						conversation.users = friends;
						conversation.save(function (err) {
			                if (err) { 
			                  return next(err);
			                }
			                res.redirect("/chat");
			            });
				}
			});
        else
			res.redirect('/user/login');
	}
];

exports.sendMessage = function(req, res, next) {

	var user = req.body.user;

	Conversation
	.findById(req.body.conversationID)
	.then((conversation) => {
		if(!conversation)
			res.send({msg: "Conversation not found"});
		else {
			var message = new Message({
				from: user,
				conversation: conversation,
				text: req.body.text,
				date: new Date()
			});
			message.save(function(err) {
				if(err)
					return next(err);
				res.send({
					from: user.name,
					text: req.body.text
				});
			})
		}
	})
}

exports.getMessages = function(req, res, next) {

	Conversation
	.findById(req.query.conID)
	.then((conversation) => {
		if(!conversation)
			res.send({msg: "Conversation not found"});
		else {
			Message
			.find({conversation: conversation})
			.populate('from')
			.select('text from')
			.exec(function(err, list_msg) {
      			if (err) { console.log(err); return next(err); }
      			res.send(list_msg);
			});
		}
	})
}