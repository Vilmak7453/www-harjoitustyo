"use strict";
import Chart from "chart.js";
import request from "superagent";
import pattern from "patternomaly";

//Color options for graphs
var backgroundColorsOptions = ['rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)'];
var borderColorsOptions = ['rgba(255,99,132,1)',
			                'rgba(54, 162, 235, 1)'];

//Calculate counts for scores world wide
//And draw bar chart
request
.get('/statistics/worldSum')
.then(res => {
		if(res.body !== undefined) {

			var bgColors = [];
			var bdColors = [];
			var amounts = [];
			var values = [];

	    	for(var i = 0; i < res.body.length; i++) {
	  			amounts.push(res.body[i].amount);
	  			values.push(res.body[i].value);

	  			//Every second bar is blue and every another is red
	  			if(Math.round(i/2) > i/2) {
	  				bgColors.push(backgroundColorsOptions[0]);
	  				bdColors.push(borderColorsOptions[0])
	  			}
	  			else {
	  				bgColors.push(backgroundColorsOptions[1]);
	  				bdColors.push(borderColorsOptions[1])
	  			}
	      	}

	      	//Find canvas
			var context = document.getElementById("worldSum");

			var worldSumChart = new Chart(context, {
			    type: 'bar',
			    data: {
			        labels: values,
			        datasets: [{
			            label: 'Tulosjakauma: maailma',
			            data: amounts,
			            backgroundColor: pattern.generate(bgColors),
			            borderColor: bdColors,
			            borderWidth: 1
			        }]
			    }
			});
  		}

		//Calculate counts for scores from friend base including logged user if user is logged
		//And draw bar chart
  		request
		.get('/statistics/authOp/friendSum')
		.then(res => {
				if(res.body.empty === undefined) {

					var bgColors = [];
					var bdColors = [];
					var amounts = [];
					var values = [];

			    	for(var i = 0; i < res.body.length; i++) {
			  			amounts.push(res.body[i].amount);
			  			values.push(res.body[i].value);

	  					//Every second bar is blue and every another is red
			  			if(Math.round(i/2) > i/2) {
			  				bgColors.push(backgroundColorsOptions[0]);
			  				bdColors.push(borderColorsOptions[0])
			  			}
			  			else {
			  				bgColors.push(backgroundColorsOptions[1]);
			  				bdColors.push(borderColorsOptions[1])
			  			}
			      	}

			      	//Find canvas
					var context = document.getElementById("friendSum");

					var friendSumChart = new Chart(context, {
					    type: 'bar',
					    data: {
					        labels: values,
					        datasets: [{
					            label: 'Tulosjakauma: kaverit',
					            data: amounts,
					            backgroundColor: pattern.generate(bgColors),
					            borderColor: bdColors,
					            borderWidth: 1
					        }]
					    }
					});
		  		}

				//Calculate the average scores for every temperature world wide
				//And draw line chart
		  		request
				.get('/statistics/worldAvgWeather')
				.then(res => {
						if(res.body !== undefined) {

							var averages = [];
							var values = [];
					    	for(var i = 0; i < res.body.length; i++) {
					  			averages.push(res.body[i].avg);
					  			values.push(JSON.stringify(res.body[i].value).split("\"")[3]);
					      	}

					      	//Find canvas
							var context = document.getElementById("worldAvgWeather");

							var worldAvgWeatherChart = new Chart(context, {
							    type: 'line',
							    data: {
							        labels: values,
							        datasets: [{
							            label: 'Keskitulos Lappeenrannan lämpötilan suhteen:\n maailma',
							            data: averages,
							            borderColor: borderColorsOptions[1],
							            backgroundColor: backgroundColorsOptions[1],
							            fill: false,
							            responsive: true
							        }]
							    }
							});
				  		}

						//Calculate the average scores for every temperature  from friend base including logged user if logged in
						//And draw line chart
				  		request
						.get('/statistics/authOp/friendAvgWeather')
						.then(res => {
								if(res.body.empty === undefined) {

									var averages = [];
									var values = [];
							    	for(var i = 0; i < res.body.length; i++) {
							  			averages.push(res.body[i].avg);
							  			values.push(JSON.stringify(res.body[i].value).split("\"")[3]);
							      	}

									var context = document.getElementById("friendAvgWeather");

									var friendAvgWeatherChart = new Chart(context, {
									    type: 'line',
									    data: {
									        labels: values,
									        datasets: [{
									            label: 'Keskitulos Lappeenrannan lämpötilan suhteen: kaverit',
									            data: averages,
							            		borderColor: borderColorsOptions[1],
							           			backgroundColor: backgroundColorsOptions[1],
							            		fill: false,
							          			responsive: true
									        }]
									    }
									});
						  		}
							})
							.catch(err => {
						  		console.log("Error retrieving scores " + err.message);
							}
						);
					})
					.catch(err => {
				  		console.log("Error retrieving scores " + err.message);
					}
				);
			})
			.catch(err => {
		  		console.log("Error retrieving scores " + err.message);
			}
		);
	})
	.catch(err => {
  		console.log("Error retrieving scores " + err.message);
	}
);