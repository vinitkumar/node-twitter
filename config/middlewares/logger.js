const mongoose = require('mongoose');
const Analytics = mongoose.model('Analytics');
const logger = require('../../app/middlewares/logger');


exports.analytics = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (req.ip !== undefined) {
    const crudeIpArray = req.ip.split(':');
    const ipArrayLength = crudeIpArray.length;
    // cleanup IP to remove unwanted characters
    const cleanIp = crudeIpArray[ipArrayLength - 1];
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
      }
    });
  }
  next();
};
