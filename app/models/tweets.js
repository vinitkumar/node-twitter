
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , Schema = mongoose.Schema


/**
 * Tweet Schema
 */


var TweetSchema = new Schema({
  title: {type: String, default: '', trim: true},
  body: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref:'User'},
  favorites: Number,
  retweets: Number,
  createAt: {type: Date, default: Date.now}
})




/**
 * Validations
 */



TweetSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Tweet title cannot be blank')


TweetSchema.path('body').validate(function (title) {
  return body.length > 0
}, 'Tweet body cannot be blank')


TweetSchema.methods = {
  Save: function(err,cb) {
    if (err) console.log('some error')
    self.save(cb)
  }
}

TweetSchema.statics = {
  /**
   * Find tweet by id
   * @param  {Object}   id [description]
   * @param  {Function} cb [description]
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id: id })
      .populate('user', 'name email')
      .exec(cb)
  },

  /**
   * List tweets
   * @param  {[type]}   options [description]
   * @param  {Function} cb      [description]
   * @return {[type]}           [description]
   */
  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Tweet', TweetSchema)
