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

  Analytics.list(options, (error, analytics) => {
    if (error) {
      return res.render("500");
    }
    Analytics.count().exec( (error, pageViews) => {
      if (error) {
        return res.render("500");
      }
      console.log(createPagination(req, Math.ceil(pageViews / perPage), page+1));
      let pagination = createPagination(req, Math.ceil(pageViews / perPage), page+1)
      Tweet.countTotalTweets( (error, tweetCount) => {
        res.render("analytics/analytics", {
          title: "List of users",
          analytics: analytics,
          pageViews: pageViews,
          tweetCount: tweetCount,
          pagination: pagination,
          pages: Math.ceil(pageViews / perPage)
        });
      });
    });
  });
};

function createPagination (req, pages, page) {
  let params = qs.parse(url.parse(req.url).query)
  let str = ''
  // params.page = 1
  // var clas = page == 1 ? "active" : "no"
  let clas
  let pageCutLow = page - 2;
  let pageCutHigh = page + 2;
  if (page > 1) {
    str += '<li class="no"><a href="?page='+(page-1)+'">Previous</a></li>';
  }
  if (page > 2) {
    str += '<li class="no"><a href="?page=1">1</a></li>';
    str += '<li class="out-of-range">...</li>';
  }
  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      params.page = p
      clas = page == p ? "active" : "no"
      let href = '?' + qs.stringify(params)
      str += '<li class="'+clas+'"><a href="'+ href +'">'+ p +'</a></li>'
    }
  } else {
    for (let p = page-1; p <= page+1; p++) {
      if (p === 0) {
        p += 1;
        pageCut = page + 3;
      }
      if (p > pages) {
        continue
      }
      // if (p >= pageCutLow && p <= pageCutHigh ) {
        params.page = p
        clas = page == p ? "active" : "no"
        let href = '?' + qs.stringify(params)
        str += '<li class="'+clas+'"><a href="'+ href +'">'+ p +'</a></li>'
        // if (p === pageCut) {
        //   params.page = p
        //   clas = "no"
        //   let href = '?' + qs.stringify(params)
        //   str += '<li class="'+clas+'"><a href="'+ href +'">...</a></li>'
        // } else {
        //
        // }
      // }
    }
  }
  if (page < pages-2) {
    str += '<li class="out-of-range">...</li>';
    str += '<li class="no"><a href="?page='+pages+'">'+pages+'</a></li>';
  }
  if (page < pages) {
    str += '<li class="no"><a href="?page='+(page+1)+'">Next</a></li>';
  }
  return str
}
