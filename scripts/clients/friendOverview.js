"use strict";
import request from 'superagent';

Vue.component("request-component", {
	props: ['request'],
	template: '<li class="collection-item">' + 
			'<div><a type="text">{{request.name}}</a>' +
			'<a class="secondary-content blue-text text-darken-1 white small" v-on:click="$emit(\'accept-friend\')">' +
			'<i class="material-icons">person_add</i></a></div></li>'
})

Vue.component("friend-component", {
	props: ['friend'],
	template: '<li class="collection-item">' + 
			'<div><a type="text">{{friend.name}}</a></div></li>'
})

var overviewApp = new Vue({
	el: "#overview",
	data: {
		friendRequests: [],
		friends: [],
		errortext: ""
	},
	mounted() {

		this.errortext = "";
		request
		.get('/friend/getFriendRequests')
		.then(res => {
	   		console.log(res.body);
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.friendRequests.push({
						name: res.body[i].name,
						userID: res.body[i].userID
					});
		      	}
		  	}
	   	})
	   	.catch(err => {
	      console.log("Error retrieving requests " + err.message);
   		});

   		request
		.get('/friend/getFriends')
		.then(res => {
	   		console.log(res.body);
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.friends.push({
						name: res.body[i].name
					});
		      	}
		  	}
	   	})
	   	.catch(err => {
	      console.log("Error retrieving requests " + err.message);
   		});
	},
	methods: {
		acceptFriend: function(req) {

			request
			.post('/friend/acceptFriend')
			.type("json")
			.send({newFriendID: req.userID})
			.then((res) => {
				if(res.body.msg !== undefined) {
		        	this.errortext = res.body.msg;
		        	return;
				}
			});
		}
	}

})