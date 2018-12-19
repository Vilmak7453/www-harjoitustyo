"use strict";
var Score = require("../models/score");
var Friendship = require("../models/friendship");

exports.score_save = function(req, res, next) {
	var highScore = req.body.score;

	if(testScore(highScore) === true) {
		var user = req.body.user;
		var score;
		if(req.body.temp === undefined || !testTemperature(req.body.temp))
			score = new Score({
				value: highScore,
				user: user
			});
		else
			score = new Score({
				value: highScore,
				user: user,
				temperature: req.body.temp
			});
		score.save(
			function (err) {
                if (err) { 
                	console.log("Saving score failed.");
                	return; }
        });
	}
	else {
		console.log("Score not number: " + highScore);
	}
};

exports.score_list = function(req, res, next) {

	var user = req.body.user;
	Score.find()
	.populate('user')
	.sort([["value", "descending"]])
	.limit(10)
	.exec(function (err, list_score_world) {
    	if (err) { console.log(err); return next(err); }
      
      	if(user !== null && user !== undefined) {
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
						friendList.push(friend.user1);
					else
						friendList.push(friend.user2);
				});
				friendList.push(user);

				Score
				.find({user: {$in: friendList} })
				.populate('user')
				.sort([["value", "descending"]])
				.limit(10)
				.exec(function(err, list_score_friends) {
    				if (err) { console.log(err); return next(err); }

    				res.render('scoreboard', { title: "Top listat", score_list_world: list_score_world, score_list_friends: list_score_friends, user: user });
				});
			});
		}
		else
    		res.render('scoreboard', { title: "Top listat", score_list_world: list_score_world, user: user });
    });
};

function testScore(score) {

	var regex = RegExp("^[0-9]+$");
	return regex.test(score);
};

function testTemperature(temp) {

	var regex = RegExp("^[0-9.\-]+$");
	return regex.test(temp);
};

exports.getHighscoreByUser = function(req, res, next) {
	
	Score.find({user: req.body.user})
		.sort([["value", "descending"]])
		.exec(function (err, list_score) {
		  if(err) { console.log(err); res.send({score: 0}); }

		  res.send({score: Array.isArray(list_score) ? (list_score[0] === undefined ? 0 : list_score[0].value) : 0});
		});
};

exports.getUsersScores = function(req, res, next) {

	Score.find({user: req.body.user})
		.sort([["value", "descending"]])
		.limit(20)
		.exec(function (err, list_score) {
		  if(err) { console.log(err); res.send(); }
		  var newlist = [];
		  list_score.forEach(function(score) {
		  	newlist.push({value: score.value,
		  				date: score.date_formatted,
		  				temperature: score.temperature.toString()});
		  });
		  res.send(newlist);
		});
}

exports.getUsernameEmailPoints = function(req, res, next) {

	Score.find({user: req.body.user})
		.sort([["value", "descending"]])
		.limit(20)
		.exec(function (err, list_score) {
		  if(err) { console.log(err); res.send(); }
		  var newlist = [];
		  list_score.forEach(function(score) {
		  	newlist.push([score.value, score.temperature.toString(), score.date_formatted]);
		  });
		  res.send({username: req.body.user.name, email: req.body.user.email, points: newlist});
		});
}

exports.remove_all_scores = function() {
	
	console.log("Remove all scores");
	Score.find()
		.remove()
		.exec();
};