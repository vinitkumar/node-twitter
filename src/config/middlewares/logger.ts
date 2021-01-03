const mongoose = require('mongoose');
const Analytics = mongoose.model('Analytics');
const logger = require('../../app/middlewares/logger');


exports.analytics = (req, res, next) => {
  // A lot of analytics is missed because users might have
  // malinformed IPs. Let's just get rid of the IP data altogether and log user irrepsective
  // of that. For backward compatiblity, we will just store a dummy IP for all future users.
  // This will also result in lesser code both in complexity and in line count.
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  // cleanup IP to remove unwanted characters
  const cleanIp = '129.23.12.1';
  Analytics.findOne({ user: req.user}).sort({ createdAt: -1 }).exec(function (err, analytics) {
    let date = new Date();
    if (analytics !== null) {
      if (new Date(analytics.createdAt).getDate() !== date.getDate()) {
        if (req.get('host').split(':')[0] !== 'localhost') {
          const analytics = new Analytics({
            ip: cleanIp,
            user: req.user,
            url: url
          });
          analytics.save(err => {
            if (err) {
              logger.log(err);
            }
          });
        }
      } else {
        logger.log('Not creating a new analytics entry on the same day');
      }
    } else {
      // it means this user is a new user and do not have a analytics object yet
      if (req.get('host').split(':')[0] !== 'localhost') {
        const analytics = new Analytics({
          ip: cleanIp,
          user: req.user,
          url: url
        });
        analytics.save(err => {
          if (err) {
            logger.log(err);
          }
        });
      }
    }
  });
  next();
};
