"use strict";
import request from 'superagent';

Vue.component("result-component", {
	props: ['result'],
	template: '<li class="collection-item">' + 
			'<p> {{result.name}}</p></li>'
})

var searchApp = new Vue({
	el: '#search',
	data: {
		results: [],
		searchKey: "",
	},
	methods: {
		search: function() {
			request
		   	.get('/friend/searchFriendsWithName')
		   	.send({key: searchKey})
		   	.then(res => {
		      console.log(res.body);
		      for(var i = 0; i < res.body.length; i++) {
		      	this.results.push({
					name: res.body[i].name,
					userID: res.body[i]._id
				});
		      }
		   	})
		   	.catch(err => {
		      console.log("Error retrieving users " + err.message);
	   		});
		},
		addFriend: function(useID) {
			console.log("Lisää kaveri " + userID);
		}

	}
})
