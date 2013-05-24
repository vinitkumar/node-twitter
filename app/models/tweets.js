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
  title: {type: String, default: '', trim: true},
  body: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  retweets: Number,
  favorite: Number
});


TweetSchema.path('body').validate(function (title) {
  return body.length > 0 && body.length < 140;
}, 'Keep tweet between 0 and 140 characters');


TweetSchema.statics = {
  /**
   * Load
   * @return {[type]} [description]
   */
  load: function (id, cb) {
    this.findOne({_id: id})
      .populate('user','name email')
      .populate('comments.user')
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}


mongoose.model('Tweet', TweetSchema);

