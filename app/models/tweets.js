var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema,
    utils = require('../../lib/utils')


//  Getters and Setters
var getTags = function (tags) {
  return tags.join(',');
};

var setTags = function (tags) {
  return tags.split(',');
};


// Tweet Schema
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


// Pre save hook
TweetSchema.pre('save', function (next) {
  if (this.favorites) this.favoritesCount = this.favorites.length;
  if (this.favorites) this.favoriters = this.favorites;
  next();
});


// Validations in the schema
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
  },

  removeComment: function (commentId, cb) {
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) {
      this.comments.splice(index, 1);
    } else {
      return cb('not found');
    }
    this.save(cb);
  }
};


// ## Static Methods in the TweetSchema
TweetSchema.statics = {
  // Load tweets
  load: function (id, cb) {
    this.findOne({ _id: id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb);
  },

  // List tweets
  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },
  // Tweets of User
  userTweets: function(id, cb) {
    this.find({"user": ObjectId(id)})
        .toArray()
        .exec(cb);
  },

  // Count the number of tweets
  countTweets: function (id, cb) {
    this.find({"user": ObjectId(id)})
        .length()
        .exec(cb);
  }
};

mongoose.model('Tweet', TweetSchema);