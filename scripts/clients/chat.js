"use strict";
import request from 'superagent';

Vue.component("conversation-component", {
	props: ['conversation'],
	template: '<li>' + 
			'<a v-on:click="$emit(\'open-conversation\')">{{conversation.groupName}}</a></li>'
})

Vue.component("message-component", {
	props: ['message'],
	template: '<li>' + 
			'<a>{{message.from}}: {{message.text}}</a></li>'
})

var chatApp = new Vue({
	el: "#chat",
	data: {
		conversations: [],
		messages: [],
		selectedConversation: "",
		newMessage: ""
	},
	mounted() {

		request
		.get('/chat/getConversations')
		.then(res => {
	   		console.log(res.body);
	   		if(res.body !== undefined) {
		    	for(var i = 0; i < res.body.length; i++) {
	      			this.conversations.push({
						groupName: res.body[i].groupName,
						ID: res.body[i]._id,
						users: res.body[i].users
					});
		      	}
		  	}
	   	})
	   	.catch(err => {
	      console.log("Error retrieving requests " + err.message);
   		});
	},
	methods: {
		openConversation: function(con) {
			this.selectedConversation = con;
			this.messages = [];

			request
			.get("/chat/getMessages")
			.query({conID: con.ID})
			.then((res) => {
		    	console.log(res.body);
		    	if(res.body !== null)
			    	for(var i = 0; i < res.body.length; i++) {
			      		this.messages.push({
							from: res.body[i].from.name,
							text: res.body[i].text
						});
			    	}
			})
		   	.catch(err => {
		      console.log("Error retrieving messages " + err.message);
		  	});
		},
		sendMessage: function() {

			request
			.post("/chat/sendMessage")
			.type('json')
			.send({ text: this.newMessage,
					conversationID: this.selectedConversation.ID })
			.then((res) => {

				if(res.body.msg !== undefined) {
			      	return;
				}
				else {							
					this.messages.push({
						from: res.body.from,
						text: res.body.text
					});
					this.newMessage = "";	
				}	
			    }
			);
		}
	}
})