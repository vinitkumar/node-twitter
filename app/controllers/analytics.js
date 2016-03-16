var mongoose = require('mongoose');
var Analytics = mongoose.model('Analytics');

exports.index = function(req, res) {
  // TODO: add pagination
  Analytics.list({}, function(err, analytics) {
    res.render('analytics/index', {
      title: 'List of users',
      analytics: analytics
    });
  });
};
