"use strict";
import request from 'superagent';

Vue.component("result-component", {
	props: ['result'],
	template: '<li class="collection-item">' + 
			'<div><a :href="result.url" type="text">{{result.name}}</a>' +
			'<a class="secondary-content blue-text text-darken-1 white small" v-on:click="$emit(\'add-friend\')">' +
			'<i class="material-icons">person_add</i></a></div></li>'
})

var searchApp = new Vue({
	el: '#search',
	data: {
		results: [],
		searchKey: "",
		errortext: ""
	},
	methods: {
		search: function() {

			this.errortext = "";
			request
		   	.get('/friend/searchFriendsWithName')
		   	.query({key: this.searchKey})
		   	.then(res => {
		   		this.results = [];
		    	if(res.body !== null)
			    	for(var i = 0; i < res.body.length; i++) {
			      		this.results.push({
							name: res.body[i].name,
							userID: res.body[i]._id,
							url: "/profile/visit/" + res.body[i]._id
						});
			    	}
		   	})
		   	.catch(err => {
		      console.log("Error retrieving users " + err.message);
	   		});
		},
		addFriend: function(result) {

			request
			.post("/friend/sendFriendRequest")
			.type("json")
			.send({userID: result.userID})
			.then((res) => {
				if(res.body.msg !== undefined) {
		        	this.search();
		        	this.errortext = res.body.msg;
		        	return;
				}
			});
		}

	}
})
