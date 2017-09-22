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
  Analytics.list(options, (error, analytics) => {
    if (error) {
      return res.render("500");
    }
    Analytics.count().exec( (error, pageViews) => {
      if (error) {
        return res.render("500");
      }
      Tweet.countTotalTweets( (error, tweetCount) => {
        res.render("analytics/analytics", {
          title: "List of users",
          analytics: analytics,
          pageViews: pageViews,
          tweetCount: tweetCount,
          page: page + 1,
          pages: Math.ceil(pageViews / perPage)
        });
      });
    });
  });
};
