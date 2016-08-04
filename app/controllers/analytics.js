const mongoose = require('mongoose');
const Analytics = mongoose.model('Analytics');

exports.index = (req, res) => {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 10;
  var options =  {
    perPage: perPage,
    page: page
  };
  Analytics.list(options, (err, analytics) => {
    if (err) {
      return res.render('500');
    }
    Analytics.count().exec((err, count) => {
      res.render('analytics/index', {
        title: 'List of users',
        analytics: analytics,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    })
  });
};
