/**
 * Module dependencies
 */

var mongoose = require('mongoose'),
    async = require('async'),
    Tweet = mongoose.model('Tweet'),
    _ = require('underscore');


/**
 * Find tweet by id
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.tweet = function (req, res, next, id) {
  var User = mongoose.model('User')

  Tweet.load(id, function (err, tweet) {
    if (err) return next(err)
    if (!tweet) return next(new Error('Failed to load tweet'+id))
    req.tweet = tweet
    next()
  })
}

/**
 * New Tweet
 * @param req [description]
 * @param res [description]
 * @return {[type]}     [description]
 */
exports.new = function(req, res) {
  res.render('tweets/new', {
    title: 'New Tweet',
    tweet: new Tweet({})
  })
}



/**
 * Create a tweet
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.create = function (req, res) {
  var tweet = new Tweet(req.body)
  console.log(req.body)
  console.log(tweet)
  tweet.user = req.user
  tweet.uploadAndSave(req.files.image, function(err) {
    if (err) {
      res.render('tweets/new',{
        title: 'New Tweet',
        tweet: tweet,
        error: err.errors
      })
    }
    else {
      res.redirect('/tweets/'+tweet._id)
    }
  })
}


/**
 * Edit a tweet
 * @param  req [description]
 * @param  res [description]
 * @return {[type]}     [description]
 */
exports.edit = function (req, res) {
  res.render('tweets/edit', {
    title: 'Edit'+ req.tweet.title,
    tweet: req.tweet
  });
};


/**
 * Show tweet
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.show = function (req, res) {
  res.render('tweets/show', {
    title: req.tweet.title,
    tweet: req.tweet
  })
}

/**
 * View an article
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.update = function (req, res) {
  var tweet = req.tweet;
  tweet = _.extend(tweet, req.body);
  tweet.uploadAndSave(req.files.image, function (err){
    if (err) {
      res.render('tweets/edit', {
        title: 'Edit Tweet',
        tweet: tweet,
        error: err.errors
      });
    }
    else {
      res.redirect('/tweets/'+ tweet._id);
    }
  })
}

/**
 * Delete an Article
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.destroy = function (req, res) {
  var tweet = req.tweet
  tweet.remove(function (err) {
    res.redirect('/tweets');
  })
}


/**
 * List of Tweets
 */


exports.index = function (req, res) {
  var page = req.param('page') > 0 ? req.param('page'):0
  var perPage  = 15
  var options = {
    perPage: perPage,
    page: page
  }
  Tweet.list(options, function (err, tweets) {
    if (err) return res.render('500');
    Tweet.count().exec(function (err, count) {
      res.render('tweets/index', {
        title: 'List of tweets',
        tweets: tweets,
        page: page,
        pages: count/perPage
      })
    })
  })
}
