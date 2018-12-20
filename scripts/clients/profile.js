"use strict";
import request from 'superagent';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//Component that shows user's top 20 scores
Vue.component("score-component", {
	props: ['score'],
	template: '<tr>' + 
				'<td> {{score.value}} </td>' + 
				'<td> {{score.temperature}} </td>' +
				'<td> {{score.date}} </td>' + 
			'</tr>'
})

//Component that shows user's stats for example played games, highscore etc.
Vue.component("stat-component", {
	props: ['statistic'],
	template: '<li>' + 
			'<p> {{statistic.name}}: {{statistic.value}}</p></li>'
})

var profileApp = new Vue({
	el: '#profile',
	data: {
		scores: [],
		stats: []
	},
	mounted() {

		request
	   	.get('/profile/auth/getUsersScores')
	   	.then(res => {
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.scores.push({
						value: res.body[i].value,
						date: res.body[i].date,
						temperature: res.body[i].temperature
					});
		      	}
		  	}
	   	})
	   	.catch(err => {
	      console.log("Error retrieving scores " + err.message);
   		});

	   	request
	   	.get('/statistics/auth/getUserStatistics')
	   	.then(res => {
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.stats.push({
						name: res.body[i].name,
						value: res.body[i].value
					});
		      	}
		  	}
	   	})
	   	.catch(err => {
	      console.log("Error retrieving scores " + err.message);
   		});
	},
	methods: {
		//Generate and download PDF of user's profile page including email, top 20 scores and stats
		downloadPDF: function() {
			
			//Get user's username, email and top 20 scores
			request
			.get('/profile/auth/getUsernameEmailPoints')
			.then(res => {
				var username = res.body.username;
				var email = res.body.email;

				//Scores must be set in table as list of rows. Rows are list
				var points = [];
				points.push(['Pisteet', 'Lämpötila', 'Päivämäärä']);
				for(var i = 0; i < res.body.points.length; i++) {
					points.push(res.body.points[i]);
				}

				var docDefinition = {
					content: [
						{text: "Käyttäjän " + username + " tilastot", style: 'header'},
						"Sähköposti: " + email,
						this.stats[0].name + ": " + this.stats[0].value,
						this.stats[1].name + ": " + this.stats[1].value,
						this.stats[2].name + ": " + this.stats[2].value,
						this.stats[3].name + ": " + this.stats[3].value,
						this.stats[4].name + ": " + this.stats[4].value,
						this.stats[5].name + ": " + this.stats[5].value,
						"\n\n",
						{text: "Top 20", style: 'subheader'},
						{table: {
							headerRows: 1,
							body: points								
						}}
					],
					styles: {
						header: {
							fontSize: 22,
							bold: true,
							alignment: 'center',
							margin: [5, 5, 5, 5]
						},
						subheader: {
							fontSize: 15,
							bold: true,
							margin: [5, 5, 5, 5]
						}
					}
				};

				pdfMake.createPdf(docDefinition).download("tilastot.pdf");
			});
		}
	}
})