const mongoose = require("mongoose");
const Analytics = mongoose.model("Analytics");
const Tweet = mongoose.model("Tweet");

exports.index = (req, res) => {
  const page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
  const perPage = 10;
  const options = {
    perPage: perPage,
    page: page
  };

  let analytics, pageViews, tweetCount;

  Analytics.list(options)
    .then(result => {
      analytics = result;
      return Analytics.count().exec();
    })
    .then(result => {
      pageViews = result;
      return Tweet.countTotalTweets()
    })
    .then(result => {
      tweetCount = result;
      res.render("analytics/analytics", {
        title: "List of users",
        analytics: analytics,
        pageViews: pageViews,
        tweetCount: tweetCount,
        page: page + 1,
        pages: Math.ceil(pageViews / perPage)
      });
    })
    .catch(error => console.log(error));
};
