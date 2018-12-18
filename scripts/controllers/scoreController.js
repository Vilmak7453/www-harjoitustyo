"use strict";
var Score = require("../models/score");

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

	Score.find()
	.populate('user')
	.sort([["value", "descending"]])
	.limit(20)
	.exec(function (err, list_score) {
      if (err) { console.log(err); return next(err); }
      //Successful, so render
      res.render('scoreboard', { title: "Scoreboard", score_list: list_score, user: req.body.user });
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

exports.remove_all_scores = function() {
	
	console.log("Remove all scores");
	Score.find()
		.remove()
		.exec();
};