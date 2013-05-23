/**
 * Module dependencies
 */


var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;



/**
 * Tweets Schema
 */


var TweetSchema = new Schema({
  body: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  retweets: Number,
  favorite: Number
});


TweetSchema.path('body').validate(function (title) {
  return body.length > 0 && body.length < 140;
}, 'Keep tweet between 0 and 140 characters');


TweetSchema.methods = {
  add: function () {

  }
}



mongoose.model('Tweet', TweetSchema);

