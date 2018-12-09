"use strict";
var Friendship = require('../models/friendship');
var User = require('../models/user');

exports.searchFriendsWithName = function(req, res, next) {

	var key = req.body.key;
	User.find({name:{ "$regex": key, "$options": "i" }})
	.limit(20)
	.exec(function (err, list_user) {
		 if(err) { console.log(err); res.send(); }
		  
		res.send(list_user);
	});
}