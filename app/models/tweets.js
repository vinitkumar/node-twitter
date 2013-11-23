
/**
 * Module dependencies
 */

var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;


/**
 * Tweet Schema
 */

var getTags = function (tags) {
  return tags.join(',');
};

var setTags = function (tags) {
  return tags.split(',');
};

var TweetSchema = new Schema({
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  favorites: [{ type: Schema.ObjectId, ref: 'User' }],
  favoriters: [{ type: Schema.ObjectId, ref: 'User' }],  // same as favorites
  favoritesCount: Number,
  createdAt  : {type : Date, default : Date.now}
});



/**
 * Pre Save hook
 */

TweetSchema.pre('save', function (next) {
  if (this.favorites) this.favoritesCount = this.favorites.length;
  if (this.favorites) this.favoriters = this.favorites;
  next();
});

/**
 * Validations
 */

TweetSchema.path('body').validate(function (body) {
  return body.length > 0;
}, 'Tweet body cannot be blank');


TweetSchema.virtual('_favorites').set(function (user) {
  if (this.favorites.indexOf(user._id) === -1) {
    this.favorites.push(user._id);
    console.log(user._id);
    console.log(this.favorites);
  } else {
    this.favorites.splice(this.favorites.indexOf(user._id), 1);
  }
});

TweetSchema.methods = {
  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb);

    var imager = new Imager(imagerConfig, 'S3');
    var self = this;

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err);
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files };
      }
      self.save(cb);
    }, 'article');
  },

  addComment: function (user, comment, cb) {
    this.comments.push({
      body: comment.body,
      user: user._id
    });
    this.save(cb);
  }
};

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
      .populate('comments.user')
      .exec(cb);
  },

  /**
   * List tweets
   * @param  {[type]}   options [description]
   * @param  {Function} cb      [description]
   * @return {[type]}           [description]
   */
  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

  /**
   * All the tweets of the user
   * @param  {[type]}   id UID of the user
   * @param  {Function} cb callback function
   * @return {[type]}      [description]
   */
  userTweets: function(id, cb) {
    this.find({"user": ObjectId(id)})
        .toArray()
        .exec(cb);
  },

  /**
   * Count the tweets by a particular user
   * @param  {[type]}   id UID of User
   * @param  {Function} cb callback
   * @return {[type]}      [description]
   */
  countTweets: function (id, cb) {
    this.find({"user": ObjectId(id)})
        .length()
        .exec(cb);
  }
};

mongoose.model('Tweet', TweetSchema);
