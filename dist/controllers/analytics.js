"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Analytics = mongoose_1.default.model("Analytics");
const Tweet = mongoose_1.default.model("Tweet");
const User = mongoose_1.default.model("User");
const querystring_1 = __importDefault(require("querystring"));
const url_1 = __importDefault(require("url"));
const logger_1 = __importDefault(require("../middlewares/logger"));
exports.createPagination = (req, pages, page) => {
    let params = querystring_1.default.parse(url_1.default.parse(req.url).query);
    let str = "";
    let pageNumberClass;
    let pageCutLow = page - 1;
    let pageCutHigh = page + 1;
    // Show the Previous button only if you are on a page other than the first
    if (page > 1) {
        str +=
            '<li class="page-item no"><a class="page-link" href="?page=' +
                (page - 1) +
                '">Previous</a></li>';
    }
    // Show all the pagination elements if there are less than 6 pages total
    if (pages < 6) {
        for (let p = 1; p <= pages; p++) {
            params.page = p;
            pageNumberClass = page == p ? "active" : "no";
            let href = "?" + querystring_1.default.stringify(params);
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
        for (let p = pageCutLow; p <= pageCutHigh; p++) {
            if (p === 0) {
                p += 1;
            }
            if (p > pages) {
                continue;
            }
            params.page = p;
            pageNumberClass = page == p ? "active" : "no";
            let href = "?" + querystring_1.default.stringify(params);
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
exports.ndex = (req, res) => {
    let createPagination = createPagination;
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const perPage = 10;
    const options = {
        perPage: perPage,
        page: page
    };
    let analytics, pageViews, tweetCount, pagination, userCount;
    Analytics.list(options)
        .then(result => {
        analytics = result;
        return Analytics.count();
    })
        .then(result => {
        pageViews = result;
        pagination = createPagination(req, Math.ceil(pageViews / perPage), page + 1);
        return Tweet.countTotalTweets();
    })
        .then(result => {
        tweetCount = result;
        return User.countTotalUsers();
    })
        .then(result => {
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
    })
        .catch(error => {
        logger_1.default.error(error);
        return res.render("pages/500");
    });
};
//# sourceMappingURL=analytics.js.map