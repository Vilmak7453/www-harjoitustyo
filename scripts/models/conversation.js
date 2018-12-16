"use strict";
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
	users: [{type: Schema.Types.ObjectId, ref: 'User'}],
	groupName: {type: String}
});

module.exports = mongoose.model('Conversation', ConversationSchema);