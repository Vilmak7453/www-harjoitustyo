"use strict";
import request from 'superagent';

//Component that lists user's conversations
Vue.component("conversation-component", {
	props: ['conversation'],
	template: '<li>' + 
			'<a v-on:click="$emit(\'open-conversation\')">{{conversation.groupName}}</a></li>'
})

//Component that shows conversation's messages. User's messages on the right without username and others' on the left with username at start of the line
Vue.component("message-component", {
	props: ['message'],
	template: '<li :class="message.align">' + 
			'<a>{{message.text}}</a></li>'
})

var chatApp = new Vue({
	el: "#chat",
	data: {
		conversations: [],
		messages: [],
		selectedConversation: "",
		newMessage: "",
		timer: "",
		latestUpdate: "",
		currentUsername: "",
		errorText: ""
	},
	mounted() {

		//Get logged user's username
		request
		.get('/chat/auth/getCurrentUsername')
		.then(res => {

			this.currentUsername = res.body.username;
			request
			.get('/chat/auth/getConversations')
			.then(res => {
		   		if(res.body !== undefined) {
			    	for(var i = 0; i < res.body.length; i++) {
		      			this.conversations.push({
							groupName: res.body[i].groupName,
							ID: res.body[i]._id,
							users: res.body[i].users,
						});
			      	}
			  	}
		   	})
		   	.catch(err => {
		    	console.log("Error retrieving requests " + err.message);
	   		});
		})
		.catch(err => {
	    	console.log("Error retrieving requests " + err.message);
		});
	},
	//Stop refreshing messages when page or conversation is closed
	beforeDestroy() {
		clearInterval(this.timer);
	},
	methods: {
		openConversation: function(con) {
			this.errorText = "";
			this.selectedConversation = con;
			this.messages = [];
			this.latestUpdate = "";

			this.getMessages();
			//Set timer that refreshes conversation every 5 seconds
			this.timer = setInterval(this.getMessages, 5000);
		},
		getMessages: function() {
			//Find messages received after latest refresh
			request
			.get("/chat/auth/getMessages")
			.query({conID: this.selectedConversation.ID, latestUpdate: this.latestUpdate})
			.then((res) => {
		    	if(res.body !== null && res.body.length !== 0) {
		    		this.removeDublicatedMessages(); //Remove messages that have been send after last refrest(they will be fetched from database)

			    	for(var i = 0; i < res.body.length; i++) {
			    		//If message is from logged user, set it on the right without username
			    		if(res.body[i].from.name.match(this.currentUsername))
				      		this.messages.push({
								text: res.body[i].text,
								date: res.body[i].date,
								align: "right-align"
							});
				      	else
			    			//If message is from someone else, set it on the left with username "Usenname: message"
				      		this.messages.push({
								text: res.body[i].from.name + ": " + res.body[i].text,
								date: res.body[i].date,
								align: "left-align"
							});
			    	}
			    	this.latestUpdate = res.body[res.body.length-1].date; //Last message that have been updated
			    }
			})
		   	.catch(err => {
		      console.log("Error retrieving messages " + err.message);
		  	});		
		},
		removeDublicatedMessages: function() {

			var i;
			//If message have been send after latest update time, remove it and every message after it from messages
			//If latestUpdate is "", all messages are sent after latest update time
			if(this.latestUpdate === "") {
				this.messages = [];
				return;
			}
			for(i = 0; i < this.messages.length; i++) {
				console.log((new Date(this.messages[i].date)).getTime());
				console.log((new Date(this.latestUpdate)).getTime());
				if((new Date(this.messages[i].date)).getTime() > (new Date(this.latestUpdate)).getTime())
					break;
			}
			this.messages.splice(i, this.messages.length - i);
		},
		sendMessage: function() {

			this.errorText = "";

			var test = this.newMessage.split(" ");
			var okMessage = true;
			//Individual words can't be over 35 characters long becouse they don't fit in the conversation field
			test.forEach(piece => {
				if(piece.length > 35) {
					this.errorText = "Yksittäinen sana ei saa olla yli 35 merkkiä pitkä!";
					okMessage = false;
				}
			});
			if(okMessage)
				request
				.post("/chat/auth/sendMessage")
				.type('json')
				.send({ text: this.newMessage,
						conversationID: this.selectedConversation.ID })
				.then((res) => {

					if(res.body.msg !== undefined) {
				      	return;
					}
					else {		

			    		//If message is from logged user, set it on the right without username
				    	if(res.body.from.match(this.currentUsername))				
							this.messages.push({
								text: res.body.text,
								date: new Date(),
								align: "right-align"
							});
						else {
			    			//If message is from someone else, set it on the left with username "Usenname: message"
							this.messages.push({
								text: res.body.from + ": " + res.body.text,
								date: new Date(),
								align: "left-align"
							});
						}
						this.newMessage = "";	
					}	
				    }
				);
		}
	}
})