const Mongoose = require('mongoose');
const Tweet = Mongoose.model('Tweet');
const User = Mongoose.model('User');
const Analytics = Mongoose.model('Analytics');

/**
 * logAnalytics - Gets all the request and feeds to our analytics
 * sysyem
 *
 * @param  {type} req Request
 */
function logAnalytics(req) {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  var analytics = new Analytics(
    {
      ip: req.ip,
      user: req.user,
      url: url
    }
  );
  analytics.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
}

exports.signin = function(req, res) {};

exports.authCallback = function(req, res) {
  res.redirect('/');
};

exports.login = function(req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  });
};

exports.signup = function(req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

exports.logout = function(req, res) {
  logAnalytics(req);
  req.logout();
  res.redirect('/login');
};

exports.session = function(req, res) {
  res.redirect('/');
};

exports.create = function(req, res, next) {
  logAnalytics(req);
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      return res.render('users/signup', {errors: err.errors, user: user});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
};

exports.list = function(req, res) {
  logAnalytics(req);
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 5;
  var options = {
    perPage: perPage,
    page: page
  };
  return User.list(options, function(err, users) {
    if (err) {
      return res.render('500');
    }
    User.count().exec(function(err, count) {
      if (err) {
        return res.render('500');
      }
      res.render('users/list',
        {
          title: 'List of Users',
          users: users,
          page: page + 1,
          pages: Math.ceil(count / perPage)
        });
    });
  });
};

exports.show = function(req, res) {
  logAnalytics(req);
  var user = req.profile;
  var reqUserId = user._id;
  var userId = reqUserId.toString();

  Tweet.find({user: userId}, function(err, tweets) {
    if (err) {
      return res.render('500');
    }
    res.render('users/show', {
      title: 'Tweets from ' + user.name,
      user: user,
      tweets: tweets
    });
  });
};

exports.user = function(req, res, next, id) {
  logAnalytics(req);
  User
    .findOne({_id: id})
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('failed to load user ' + id));
      }
      req.profile = user;
      next();
    });
};
