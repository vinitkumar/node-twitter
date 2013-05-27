
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema


/**
 * Tweet Schema
 */


/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

var TweetSchema = new Schema({
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now}
})


/**
 * Validations
 */

TweetSchema.path('body').validate(function (title) {
  return body.length > 0
}, 'Tweet body cannot be blank')

TweetSchema.methods = {
  save: function (err,cb) {
    if (err) console.log('no tweets')
    self.save(cb)
  },

  addComment: function (user, comment, cb) {
    this.comments.push({
      body: comment.body,
      user: user._id
    })
    this.save(cb)
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
