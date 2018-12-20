"use strict";
var Friendship = require('../models/friendship');
var User = require('../models/user');

//Search for new friends with piece of username
exports.searchFriendsWithName = function(req, res, next) {

	var key = req.query.key;
	var user = req.body.user;

	//Find users that logged user have already send request or is already friends with
	Friendship
	.find({$or:[{user1: user._id}, {user2: user._id}]})
	.where({accepted1: true})
	.populate('user1 user2')
	.exec(function(err, list_friendships) {
		if(err) { console.log(err); res.send(); }

		var friendList = [];
		list_friendships.forEach(function(friend) {
			var user1ID = friend.user1._id.toString();
			console.log(user1ID + "    " + user._id);
			if(!user1ID.match(user._id))
				friendList.push({name: friend.user1.name});
			else
				friendList.push({name: friend.user2.name});
		});
		friendList.push({name: user.name});	//Add also logged user so they are not shown in the results

		//Find max 20 users that match keyword
		User.find({name:{ "$regex": key, "$options": "i" }})
		.limit(20)
		.select('name')
		.exec(function (err, list_user) {
			if(err) { console.log(err); next(err); }

			var list = [];
			var remove;
			//Go through find users
			list_user.forEach(function(user) {
				remove = 0;

				//Go through friends and don't add them to results
				for(var friend of friendList) {
					if(user.name.match(friend.name)) {
						remove = 1;
						break;
					}
				};
				if(remove === 0)
					list.push(user);
			});
			res.send(list);
		});
	});
}

exports.sendFriendRequest = function(req, res, next) {

	var user1 = req.body.user;
	//Find user to which logged user is sending request
	User.findById(req.body.userID, function(err, user2) {

		var friendship = new Friendship( {
			user1: user1,
			user2: user2,
			accepted1: true
		});
		friendship.save(function(err) {
			if(err)
				res.send({msg: err.message});
			else
				res.send({msg: "Kaveripyyntö käyttäjälle " + user2.name + " lähetetty!"});
		});
	});
}

exports.getFriendRequests = function(req, res, next) {

	var user1 = req.body.user;
	var id = user1._id;

	//Find friend request where logged user is the user request is sent and check that it haven't been accepted
	Friendship
	.find({ 'user2': id })
	.where({'accepted2': false})
	.populate('user1')
	.exec(function(err, list_friendships) {
		if(err) { console.log(err); res.send(); }
		var newList = [];
		list_friendships.forEach(function(friend){
			newList.push({name: friend.user1.name,
							userID: friend.user1._id});
		});
		res.send(newList);
	});
}

exports.acceptFriend = function(req, res, next) {

	var newFriendID = req.body.newFriendID;
	var user = req.body.user;
	Friendship.findOneAndUpdate({ 'user1': newFriendID, 'user2': user._id }, {$set:{'accepted2': true}}, function(err, friendship) {
		if(err)
			res.send({msg: err.message});
		else
			res.send({msg: "Kaveripyyntö hyväksytty!"});
	});
}

//Find user's friends
exports.getFriends = function(req, res, next) {

	var user = req.body.user;
	//Only friendships that have been accepted by both users are fetched
	Friendship
	.find({$or:[{user1: user._id}, {user2: user._id}]})
	.where({accepted1: true, accepted2:true})
	.populate('user1 user2')
	.exec(function(err, list_friendships) {
    	if (err) { console.log(err); return next(err); }

		var list = [];
		list_friendships.forEach(function(friend) {
			var user1ID = friend.user1._id.toString();
			//If logged user is not user1, then the friend is
			if(!user1ID.match(user._id))
				list.push({name: friend.user1.name, ID: friend.user1._id});
			else
				list.push({name: friend.user2.name, ID: friend.user2._id});
		});
		res.send(list);
	});
}