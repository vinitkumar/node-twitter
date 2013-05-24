/**
 * Generic require login routing middlewares
 */

exports.requireLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};


/**
 * User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.redirect('/users'+req.profile.id);
    }
    next();
  }
};


exports.tweet = {
  hasAuthorization: function (req, res, next) {
    if (req.tweet.user.id != req.user.id) {
      return res.redirect('/tweets'+req.tweet.id);
    }
    next();
  }
};



