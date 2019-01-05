const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//https://github.com/ex90rts/koa-mongoose/blob/master/controllers/user.js
const Ticket = new Schema({
  '_id'        : {type: Schema.Types.ObjectId, auto: true },
  "access_token": { type: String, index: {unique: true, dropDups: true} },
  "refresh_token": { type: String, index: {unique: true, dropDups: true} },
  "usuario_id": { type: String, index: true},
  "created": { type: Date, default: Date.now, index: true },
  "updated": { type: Date, default: Date.now, index: true }
});
/*
dmReplSet:PRIMARY> var now = new Date();
dmReplSet:PRIMARY> now.getTime()
1386820859427
dmReplSet:PRIMARY> 

var dates_as_int = [
    "2016-07-19T20:23:01.804Z",
    "2016-07-20T15:43:54.776Z",
    "2016-07-22T14:53:38.634Z",
    "2016-07-25T14:39:34.527Z"
];


var dates = dates_as_int.map(function(dateStr) {
    return new Date(dateStr).getTime();
});

=>

[1468959781804, 1469029434776, 1469199218634, 1469457574527]

Update: ES6 version:

const dates = dates_as_int.map(date => new Date(date).getTime())


*/

Ticket.pre('save', function(next){
  this.updated = Date.now();
  next();
});

const model = mongoose.model('Ticket', Ticket);

module.exports = model;