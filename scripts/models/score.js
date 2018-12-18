"use strict";
var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;

var ScoreSchema = new Schema(
  {
  	user: {type: Schema.Types.ObjectId, ref: 'User', default: null},
  	value: {type: Number, require: true},
    date: {type: Date, default: Date.now},
    temperature: {type: Schema.Types.Decimal128, default: 0}
  }
);

ScoreSchema.virtual('date_formatted').get(function() {
	return moment(this.date).tz("Europe/Helsinki").format('HH:mm DD.MM.YY');
});

//Export model
module.exports = mongoose.model('Score', ScoreSchema);