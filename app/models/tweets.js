/**
 * Module dependencies
 */


var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;


/**
 * Getters
 */


var getTags = function (tags) {
  return tags.join(',');
};


/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
};


/**
 * Tweets Schema
 */


var TweetSchema = new Schema({
  body:{},

})
