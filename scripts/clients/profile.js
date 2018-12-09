"use strict";
import request from 'superagent';

Vue.component("score-component", {
	props: ['score'],
	template: '<li class="collection-item">' + 
			'<p> {{score.value}}: {{score.date}}</p></li>'
})

var profileApp = new Vue({
	el: '#profile',
	data: {
		highscore: 0,
		scores: [],
	},
	mounted() {

		request
	   	.get('/profile/getUsersScores')
	   	.then(res => {
	   		console.log(res.body);
	   		if(res.body !== undefined) {
	   			this.highscore = res.body[0].value;
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.scores.push({
						value: res.body[i].value,
						date: res.body[i].date
					});
		      	}
		  	}
	   	})
	   	.catch(err => {
	      console.log("Error retrieving scores " + err.message);
   		});
	},
	methods: {

	}
})