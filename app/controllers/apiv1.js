// ## Tweet Controller
const mongoose = require('mongoose');
const Tweet = mongoose.model('Tweet');
const User = mongoose.model('User');

exports.tweetList = (req, res) => {
  const page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  const perPage = 15;
  const options = {
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
  const page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  const perPage = 15;
  const options = {
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
