"use strict";
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FriendshipSchema = new Schema({
	user1: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	user2: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	accepted1: {type: Boolean, default: false},
	accepted2: {type: Boolean, default: false}
	}
);

module.exports = mongoose.model('Friendship', FriendshipSchema);