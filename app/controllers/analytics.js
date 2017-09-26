const mongoose = require("mongoose");
const Analytics = mongoose.model("Analytics");
const Tweet = mongoose.model("Tweet");
const qs = require('querystring')
const url = require('url')

exports.index = (req, res) => {
  const page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
  const perPage = 10;
  const options = {
    perPage: perPage,
    page: page
  };

  let analytics, pageViews, tweetCount, pagination;

  Analytics.list(options)
    .then(result => {
      analytics = result;
      return Analytics.count();
    })
    .then(result => {
      pageViews = result;
      pagination = createPagination(req, Math.ceil(pageViews / perPage), page+1)
      return Tweet.countTotalTweets()
    })
    .then(result => {
      tweetCount = result;
      res.render("analytics/analytics", {
        title: "List of users",
        analytics: analytics,
        pageViews: pageViews,
        tweetCount: tweetCount,
        pagination: pagination,
        pages: Math.ceil(pageViews / perPage)
      });
    })
    .catch(error => {
      console.log(error);
      return res.render("500");
    });
};

function createPagination (req, pages, page) {
  let params = qs.parse(url.parse(req.url).query)
  let str = ''
  let clas
  let pageCutLow = page - 1;
  let pageCutHigh = page + 1;
  if (page > 1) {
    str += '<li class="no"><a href="?page='+(page-1)+'">Previous</a></li>';
  }
  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      params.page = p
      clas = page == p ? "active" : "no"
      let href = '?' + qs.stringify(params)
      str += '<li class="'+clas+'"><a href="'+ href +'">'+ p +'</a></li>'
    }
  } else {
    if (page > 2) {
      str += '<li class="no"><a href="?page=1">1</a></li>';
      if (page > 3) {
          str += '<li class="out-of-range">...</li>';
      }
    }
    if (page === 1) {
      pageCutHigh += 2;
    } else if (page === 2) {
      pageCutHigh += 1;
    }
    if (page === pages) {
      pageCutLow -= 2;
    } else if (page === pages-1) {
      pageCutLow -= 1;
    }
    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      if (p === 0) {
        p += 1;
      }
      if (p > pages) {
        continue
      }
      params.page = p
      clas = page == p ? "active" : "no"
      let href = '?' + qs.stringify(params)
      str += '<li class="'+clas+'"><a href="'+ href +'">'+ p +'</a></li>'
    }
    if (page < pages-1) {
      if (page < pages-2) {
        str += '<li class="out-of-range">...</li>';
      }
      str += '<li class="no"><a href="?page='+pages+'">'+pages+'</a></li>';
    }
  }
  if (page < pages) {
    str += '<li class="no"><a href="?page='+(page+1)+'">Next</a></li>';
  }
  return str
}
