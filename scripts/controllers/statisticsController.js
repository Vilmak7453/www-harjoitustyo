"use strict";
var Score = require("../models/score");
var Friendship = require("../models/friendship");

//Calculate counts for scores world wide
exports.worldSum = function(req, res, next) {

	Score
	.aggregate([{
		$group: {
			_id: "$value",	//Group by the value of score aka the scored points
			count: {$sum: 1} //Calculate how many there is
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

//Calculate counts for scores from friend base including logged user
exports.friendSum = function(req, res, next) {

	var user = req.body.user;

	//Find users friends. User can be either user1 or user2 in friendship model. Both must have accepted the friend request
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
		friendList.push(user._id); //Add logged user to list also

		//Calculate the counts
		Score
		.aggregate([{
			$match: {
				user: {$in: friendList}	//Notice only users that are user's friends or user themselves
			}
		},{
			$group: {
				_id: "$value",	//Group by the value of score aka the scored points
				count: {$sum: 1} //Calculate how many there is
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

//Calculate the average scores for every temperature world wide
exports.worldAvgWeather = function(req, res, next) {

	Score
	.aggregate([{
		$group: {
			_id: "$temperature",	//Group by the temperature
			average: {$avg: "$value"} //Calculate the average according to value aka scored points
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

//Calculate the average scores for every temperature  from friend base including logged user
exports.friendAvgWeather = function(req, res, next) {

	var user = req.body.user;

	//Find users friends. User can be either user1 or user2 in friendship model. Both must have accepted the friend request
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
		friendList.push(user._id);	//Add logged user also

		//Calculate the averages
		Score
		.aggregate([{
			$match: {
				user: {$in: friendList} //Include only scores from user's friends or user
			}
		},{
			$group: {
				_id: "$temperature",	//Group by the temperature
				average: {$avg: "$value"} //Calculate the average according to value aka scored points
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

//Calculate statistics for user
exports.userStatistics = function(req, res, next) {

	Score
	.aggregate([{
		$match: {
			user: req.body.user._id
		}
	},{
		$group: {
			_id: null,
			averageValue: {$avg: "$value"},	//Average score
			averageTemperature: {$avg: "$temperature"}, //average temperature
			maxValue: {$max: "$value"},	//highscore
			minTemperature: {$min: "$temperature"},	//Lowest temperature measured
			maxTemperature: {$max: "$temperature"}, //Highest temperature measured
			count: {$sum: 1} //Played games
		}
	}])
	.exec(function(err, list_stats) {
    	if (err) { console.log(err); return next(err); }

        //Save calculated values with relevant names
    	var list = [];
		list.push({
			name: "Paras tulos",
			value: list_stats[0].maxValue
		});
		list.push({
			name: "Pelatut pelit",
			value: list_stats[0].count
		});
		list.push({
			name: "Tuloksien keskiarvo",
			value: Math.round(list_stats[0].averageValue)
		});
		list.push({
			name: "Lämpötilojen keskiarvo",
			value: Number.parseFloat(list_stats[0].averageTemperature.toString()).toFixed(2)
		});
		list.push({
			name: "Pienin lämpötila",
			value: list_stats[0].minTemperature.toString()
		});
		list.push({
			name: "Korkein lämpötila",
			value: list_stats[0].maxTemperature.toString()
		});
		res.send(list);
	})
}