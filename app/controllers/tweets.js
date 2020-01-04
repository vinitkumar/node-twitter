// ## Tweet Controller
const createPagination = require("./analytics").createPagination;
const mongoose = require("mongoose");
const Tweet = mongoose.model("Tweet");
const User = mongoose.model("User");
const Analytics = mongoose.model("Analytics");
const _ = require("underscore");
const logger = require("../middlewares/logger");

exports.tweet = (req, res, next, id) => {
  Tweet.load(id, (err, tweet) => {
    if (err) {
      return next(err);
    }
    if (!tweet) {
      return next(new Error("Failed to load tweet" + id));
    }
    req.tweet = tweet;
    next();
  });
};

// ### Create a Tweet
exports.create = (req, res) => {
  const tweet = new Tweet(req.body);
  tweet.user = req.user;
  tweet.tags = parseHashtag(req.body.body);

  tweet.uploadAndSave({}, err => {
    if (err) {
      res.render("pages/500", { error: err });
    } else {
      res.redirect("/");
    }
  });
};

// ### Update a tweet
exports.update = (req, res) => {
  let tweet = req.tweet;
  tweet = _.extend(tweet, { body: req.body.tweet });
  tweet.uploadAndSave({}, err => {
    if (err) {
      return res.render("pages/500", { error: err });
    }
    res.redirect("/");
  });
};

// ### Delete a tweet
exports.destroy = (req, res) => {
  const tweet = req.tweet;
  tweet.remove(err => {
    if (err) {
      return res.render("pages/500");
    }
    res.redirect("/");
  });
};

// ### Parse a hashtag

function parseHashtag(inputText) {
  var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/g;
  var matches = [];
  var match;
  while ((match = regex.exec(inputText)) !== null) {
    matches.push(match[1]);  
  }
  return matches;
}

exports.parseHashtag = parseHashtag;

let showTweets = (req, res, criteria) => {
  const findCriteria = criteria || {};
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 10;
  const options = {
    perPage: perPage,
    page: page,
    criteria: findCriteria
  };
  let followingCount = req.user.following.length;
  let followerCount = req.user.followers.length;
  let tweets, tweetCount, pageViews, analytics, pagination;
  User.countUserTweets(req.user._id).then(result => {
    tweetCount = result;
  });
  Tweet.list(options)
    .then(result => {
      tweets = result;
      return Tweet.countTweets(findCriteria);
    })
    .then(result => {
      pageViews = result;
      pagination = createPagination(
        req,
        Math.ceil(pageViews / perPage),
        page + 1
      );
      return Analytics.list({ perPage: 15 });
    })
    .then(result => {
      analytics = result;
      res.render("pages/index", {
        title: "List of Tweets",
        tweets: tweets,
        analytics: analytics,
        page: page + 1,
        tweetCount: tweetCount,
        pagination: pagination,
        followerCount: followerCount,
        followingCount: followingCount,
        pages: Math.ceil(pageViews / perPage)
      });
    })
    .catch(error => {
      logger.error(error);
      res.render("pages/500");
    });
};

// ### Find a tag
exports.findTag = (req, res) => {
  let tag = req.params.tag;
  showTweets(req, res, { tags: tag.toLowerCase() });
};

exports.index = (req, res) => {
  showTweets(req, res);
};
