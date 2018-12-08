"use strict";
var Score = require("../models/score");

exports.score_save = function(req, res, next) {
	var highScore = req.body.score;
	console.log("Saving score " + highScore);
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
				console.log("Score saved " + highScore);
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

exports.remove_all_scores = function() {
	
	console.log("Remove all scores");
	Score.find()
		.remove()
		.exec();
}