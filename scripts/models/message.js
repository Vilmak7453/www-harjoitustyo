"use strict";
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	conversation: {type: Schema.Types.ObjectId, ref: 'Conversation', required: true},
	text: {type: String, required: true},
	date: {type: Date, required: true}
});

module.exports = mongoose.model('Message', MessageSchema);