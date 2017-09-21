const mongoose = require("mongoose");
const Analytics = mongoose.model("Analytics");

exports.index = (req, res) => {
  const page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
  const perPage = 10;
  const options = {
    perPage: perPage,
    page: page
  };
  Analytics.list(options, (err, analytics) => {
    if (err) {
      return res.render("500");
    }
    Analytics.count().exec((err, count) => {
      if (err) {
        return res.render("500");
      }
      res.render("analytics/analytics", {
        title: "List of users",
        analytics: analytics,
        count: count,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
