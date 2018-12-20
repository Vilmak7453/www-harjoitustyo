"use strict";
var Conversation = require("../models/conversation");
var Friendship = require('../models/friendship');
var Message = require("../models/message");

var userController = require('../controllers/userController');

var { sanitizeBody } = require('express-validator/filter');
var { body,validationResult } = require('express-validator/check');

//Get conversations aka groupchats in which logged user belongs
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

//Render page for creating new conversation
exports.renderConversation = function(req, res, next) {

	var user = req.body.user;
	//Find friends
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
	
	//Validate and sanitaze groupname
	body('groupName').trim().isLength({min: 1, max: 30}).withMessage('Nimen pitää olla 1-30 merkkiä pitkä!'),
	sanitizeBody('groupName').trim().escape(),

	(req, res, next) => {

		const errors = validationResult(req);

        if (!errors.isEmpty()) {

            res.render('createConversation', { title: 'Luo uusi keskustelu', name: req.body.groupName, errors: errors.array(), user: req.body.user});	
            return;
        }
        else {
			var conversation = new Conversation({
				groupName: req.body.groupName
			});
			var friends = [];

			if(Array.isArray(req.body.groupers))
				for(var i = 0; i < req.body.groupers.length; i++) {
					friends.push(req.body.groupers[i]);
				}
			else
				friends.push(req.body.groupers);

			friends.push(req.body.user);	//Add logged user to conversation also
			conversation.users = friends;
			conversation.save(function (err) {
                if (err) { 
                  return next(err);
                }
                res.redirect("/chat");
            });
		}
	}
];

exports.sendMessage = function(req, res, next) {

	var user = req.body.user;

	//Find conversation to which message is sent
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

//Get conversation's messages
exports.getMessages = function(req, res, next) {

	//Time when last time messages where fetched. Same old messages are unnecessary to fetch again
	var latestUpdate = req.query.latestUpdate;

	//Find right conversation
	Conversation
	.findById(req.query.conID)
	.then((conversation) => {
		if(!conversation)
			res.send({msg: "Conversation not found"});
		else {
			//if messages haven't been fetched before latestUpdate will be empty string
			if(latestUpdate === "")
				//Find all messages
				Message
				.find({conversation: conversation})
				.populate('from')
				.select('text from date')
				.exec(function(err, list_msg) {
	      			if (err) { console.log(err); return next(err); }
	      			res.send(list_msg);
				});
			else {
				//Find only recent messages
				Message
				.find({conversation: conversation})
				.where({date: {$gt: latestUpdate}})
				.populate('from')
				.select('text from date')
				.exec(function(err, list_msg) {
	      			if (err) { console.log(err); return next(err); }
	      			res.send(list_msg);
				});
			}
		}
	});
}