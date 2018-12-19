"use strict";
var Score = require("../models/score");
var Friendship = require("../models/friendship");

exports.worldSum = function(req, res, next) {

	Score
	.aggregate([{
		$group: {
			_id: "$value",
			count: {$sum: 1}
		}
	},{
		$sort: {
			_id: 1
		}
	}])
	.exec(function(err, list_sums) {
    	if (err) { console.log(err); return next(err); }

    	var list = [];
		list_sums.forEach(function(sum) {
			list.push({
				value: sum._id,
				amount: sum.count
			})
		});
		res.send(list);
	})
};

exports.friendSum = function(req, res, next) {

	var user = req.body.user;
	Friendship
	.find({$or:[{user1: user._id}, {user2: user._id}]})
	.where({accepted1: true, accepted2:true})
	.populate('user1 user2')
	.exec(function(err, list_friendships) {
		if (err) { console.log(err); return next(err); }

		var friendList = [];
		list_friendships.forEach(function(friend) {
			var user1ID = friend.user1._id.toString();
			if(!user1ID.match(user._id))
				friendList.push(friend.user1._id);
			else
				friendList.push(friend.user2._id);
		});
		friendList.push(user._id);

		Score
		.aggregate([{
			$match: {
				user: {$in: friendList}
			}
		},{
			$group: {
				_id: "$value",
				count: {$sum: 1}
			}
		},{
			$sort: {
				_id: 1
			}
		}])
		.exec(function(err, list_sums) {
	    	if (err) { console.log(err); return next(err); }

	    	var list = [];
			list_sums.forEach(function(sum) {
				list.push({
					value: sum._id,
					amount: sum.count
				})
			});
			res.send(list);
		})
	});
};

exports.worldAvgWeather = function(req, res, next) {

	Score
	.aggregate([{
		$group: {
			_id: "$temperature",
			average: {$avg: "$value"}
		}
	},{
		$sort: {
			_id: 1
		}
	}])
	.exec(function(err, list_avgs) {
    	if (err) { console.log(err); return next(err); }

    	var list = [];
		list_avgs.forEach(function(avg) {
			list.push({
				value: avg._id,
				avg: avg.average
			})
		});
		res.send(list);
	})
};

exports.friendAvgWeather = function(req, res, next) {

	var user = req.body.user;
	Friendship
	.find({$or:[{user1: user._id}, {user2: user._id}]})
	.where({accepted1: true, accepted2:true})
	.populate('user1 user2')
	.exec(function(err, list_friendships) {
		if (err) { console.log(err); return next(err); }

		var friendList = [];
		list_friendships.forEach(function(friend) {
			var user1ID = friend.user1._id.toString();
			if(!user1ID.match(user._id))
				friendList.push(friend.user1._id);
			else
				friendList.push(friend.user2._id);
		});
		friendList.push(user._id);

		Score
		.aggregate([{
			$match: {
				user: {$in: friendList}
			}
		},{
			$group: {
				_id: "$temperature",
				average: {$avg: "$value"}
			}
		},{
			$sort: {
				_id: 1
			}
		}])
		.exec(function(err, list_avgs) {
	    	if (err) { console.log(err); return next(err); }

	    	var list = [];
			list_avgs.forEach(function(avg) {
				list.push({
					value: avg._id,
					avg: avg.average
				})
			});
			res.send(list);
		})
	});
};