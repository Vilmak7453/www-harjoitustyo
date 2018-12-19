"use strict";
import request from 'superagent';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

Vue.component("score-component", {
	props: ['score'],
	template: '<li class="collection-item">' + 
			'<p> {{score.value}} pistett&auml; {{score.temperature}}&deg;C klo {{score.date}}</p></li>'
})

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
	   	.get('/profile/getUsersScores')
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
	   	.get('/statistics/getUserStatistics')
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
		downloadPDF: function() {
			
			request
			.get('/profile/getUsernameEmailPoints')
			.then(res => {
				var username = res.body.username;
				var email = res.body.email;

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