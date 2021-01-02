"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Analytics = mongoose_1["default"].model("Analytics");
var Tweet = mongoose_1["default"].model("Tweet");
var User = mongoose_1["default"].model("User");
var qs = require("querystring");
var url = require("url");
var logger = require("../middlewares/logger");
exports.createPagination = function (req, pages, page) {
    var params = qs.parse(url.parse(req.url).query);
    var str = "";
    var pageNumberClass;
    var pageCutLow = page - 1;
    var pageCutHigh = page + 1;
    // Show the Previous button only if you are on a page other than the first
    if (page > 1) {
        str +=
            '<li class="page-item no"><a class="page-link" href="?page=' +
                (page - 1) +
                '">Previous</a></li>';
    }
    // Show all the pagination elements if there are less than 6 pages total
    if (pages < 6) {
        for (var p = 1; p <= pages; p++) {
            params.page = p;
            pageNumberClass = page === p ? "active" : "no";
            var href = "?" + qs.stringify(params);
            str +=
                '<li class="' +
                    pageNumberClass +
                    '"><a class="page-link" href="' +
                    href +
                    '">' +
                    p +
                    "</a></li>";
        }
    }
    // Use "..." to collapse pages outside of a certain range
    else {
        // Show the very first page followed by a "..." at the beginning of the
        // pagination section (after the Previous button)
        if (page > 2) {
            str +=
                '<li class="no page-item"><a class="page-link" href="?page=1">1</a></li>';
            if (page > 3) {
                str += '<li class="out-of-range">...</li>';
            }
        }
        // Determine how many pages to show after the current page index
        if (page === 1) {
            pageCutHigh += 2;
        }
        else if (page === 2) {
            pageCutHigh += 1;
        }
        // Determine how many pages to show before the current page index
        if (page === pages) {
            pageCutLow -= 2;
        }
        else if (page === pages - 1) {
            pageCutLow -= 1;
        }
        // Output the indexes for pages that fall inside the range of pageCutLow
        // and pageCutHigh
        for (var p = pageCutLow; p <= pageCutHigh; p++) {
            if (p === 0) {
                p += 1;
            }
            if (p > pages) {
                continue;
            }
            params.page = p;
            pageNumberClass = page === p ? "active" : "no";
            var href = "?" + qs.stringify(params);
            str +=
                '<li class="page-item ' +
                    pageNumberClass +
                    '"><a class="page-link" href="' +
                    href +
                    '">' +
                    p +
                    "</a></li>";
        }
        // Show the very last page preceded by a "..." at the end of the pagination
        // section (before the Next button)
        if (page < pages - 1) {
            if (page < pages - 2) {
                str += '<li class="out-of-range">...</li>';
            }
            str +=
                '<li class="page-item no"><a class="page-link" href="?page=' +
                    pages +
                    '">' +
                    pages +
                    "</a></li>";
        }
    }
    // Show the Next button only if you are on a page other than the last
    if (page < pages) {
        str +=
            '<li class="page-item no"><a class="page-link" href="?page=' +
                (page + 1) +
                '">Next</a></li>';
    }
    // Return the pagination string to be outputted in the pug templates
    return str;
};
exports.index = function (req, res) {
    var createPagination = exports.createPagination;
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var perPage = 10;
    var options = {
        perPage: perPage,
        page: page
    };
    var analytics, pageViews, tweetCount, pagination, userCount;
    Analytics.list(options)
        .then(function (result) {
        analytics = result;
        return Analytics.countDocuments();
    })
        .then(function (result) {
        pageViews = result;
        pagination = createPagination(req, Math.ceil(pageViews / perPage), page + 1);
        return Tweet.countTweets();
    })
        .then(function (result) {
        tweetCount = result;
        return User.countTotalUsers();
    })
        .then(function (result) {
        userCount = result;
        res.render("pages/analytics", {
            title: "List of users",
            analytics: analytics,
            pageViews: pageViews,
            userCount: userCount,
            tweetCount: tweetCount,
            pagination: pagination,
            pages: Math.ceil(pageViews / perPage)
        });
    })["catch"](function (error) {
        logger.error(error);
        return res.render("pages/500");
    });
};
