"use strict";
import request from 'superagent';

Vue.component("request-component", {
	props: ['request'],
	template: '<li class="collection-item">' + 
			'<div><a type="text" :href="request.url">{{request.name}}</a>' +
			'<a class="secondary-content blue-text text-darken-1 white small" v-on:click="$emit(\'accept-friend\')">' +
			'<i class="material-icons">person_add</i></a></div></li>'
})

Vue.component("friend-component", {
	props: ['friend'],
	template: '<li class="collection-item">' + 
			'<div><a :href="friend.url" type="text">{{friend.name}}</a></div></li>'
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
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.friendRequests.push({
						name: res.body[i].name,
						userID: res.body[i].userID,
						url: "/profile/visit/" + res.body[i].userID
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
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.friends.push({
						name: res.body[i].name,
						url: "/profile/visit/" + res.body[i].ID
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
					this.friends.push({
						name: req.name
					});
					for(var i = 0; i < this.friendRequests.length; i++) {
						if(this.friendRequests[i].name.match(req.name)) {
							this.friendRequests.splice(i, 1);
							break;
						}
					}
		        	this.errortext = res.body.msg;
		        	return;
				}
			});
		},
		visitFriend: function(friend) {

			request
			.get('/profile/' + friend.ID)
			.end();
		}
	}

})