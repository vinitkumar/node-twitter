// ## Tweet Controller
const mongoose = require('mongoose');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

exports.tweetList = (req, res) => {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 15;
  var options = {
    perPage: perPage,
    page: page
  };

  Tweet.limitedList(options, (err, tweets) => {
    if (err) {
      return res.render('500');
    }
    Tweet.count().exec((err, count) => {
      if (err) {
        return res.render('500');
      }
      res.send(tweets);
    });
  });
};

exports.usersList = (req, res) => {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 15;
  var options = {
    perPage: perPage,
    page: page
  };

  User.list(options, (err, users) => {
    if (err) {
      return res.render('500');
    }
    User.count().exec((err, count) => {
      if (err) {
        return res.render('500');
      }
      res.send(users);
    });
  });
};
