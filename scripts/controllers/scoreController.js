"use strict";
var Score = require("../models/score");

exports.score_save = function(req, res, next) {
	var highScore = req.body.score;
	var testResult = testScore(highScore);

	if(testResult === true) {
		var user = req.body.user;
		var score = new Score({
			value: highScore,
			user: user
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
		  	score.date = score.date_formatted;
		  	newlist.push(score);
		  });
		  console.log(newlist);
		  res.send(newlist);
		});
}

exports.remove_all_scores = function() {
	
	console.log("Remove all scores");
	Score.find()
		.remove()
		.exec();
};