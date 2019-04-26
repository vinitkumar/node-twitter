import  Mongoose from "mongoose";
const Tweet = Mongoose.model("Tweet");
const User = Mongoose.model("User");
const Analytics = Mongoose.model("Analytics");
import  logger  from "../middlewares/logger";
import { Response, Request, NextFunction } from "express";

export let signin = (req: Request, res: Response) => {};

export let authCallback = (req: Request, res: Response) => {
  res.redirect("/");
};

export let login = (req: Request, res: Response) => {
  let tweetCount: BigInteger, userCount: BigInteger, analyticsCount: BigInteger;
  let options = {};
  Analytics.list(options)
    .then(() => {
      return Analytics.count();
    })
    .then(result => {
      analyticsCount = result;
      return Tweet.countTotalTweets();
    })
    .then(result => {
      tweetCount = result;
      return User.countTotalUsers();
    })
    .then(result => {
      userCount = result;
      logger.info(tweetCount);
      logger.info(userCount);
      logger.info(tweetCount);
      res.render("pages/login", {
        title: "Login",
        message: req.flash("error"),
        userCount: userCount,
        tweetCount: tweetCount,
        analyticsCount: analyticsCount
      });
    });
};

export let signup = (req: Request, res: Response) => {
  res.render("pages/login", {
    title: "Sign up",
    user: new User()
  });
};

export let logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect("/login");
};

export let session = (req: Request, res: Response) => {
  res.redirect("/");
};

export let create = (req: Request, res: Response, next: NextFunction) => {
  const user = new User(req.body);
  user.provider = "local";
  user
    .save()
    .catch(error => {
      return res.render("pages/login", { errors: error.errors, user: user });
    })
    .then(() => {
      return req.login(user);
    })
    .then(() => {
      return res.redirect("/");
    })
    .catch(error => {
      return next(error);
    });
};

export let list = (req: Request, res: Response) => {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 5;
  const options = {
    perPage: perPage,
    page: page,
    criteria: { github: { $exists: true } }
  };
  let users, count;
  User.list(options)
    .then(result => {
      users = result;
      return User.count();
    })
    .then(result => {
      count = result;
      res.render("pages/user-list", {
        title: "List of Users",
        users: users,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};

export let show = (req: TweetRequest, res: Response) => {
  const user = req.profile;
  const reqUserId = user._id;
  const userId = reqUserId.toString();
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const options = {
    perPage: 100,
    page: page,
    criteria: { user: userId }
  };
  let tweets, tweetCount;
  let followingCount = user.following.length;
  let followerCount = user.followers.length;

  Tweet.list(options)
    .then(result => {
      tweets = result;
      return Tweet.countUserTweets(reqUserId);
    })
    .then(result => {
      tweetCount = result;
      res.render("pages/profile", {
        title: "Tweets from " + user.name,
        user: user,
        tweets: tweets,
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    })
    .catch(error => {
      return res.render("pages/500", { errors: error.errors });
    });
};

export let user = (req: TweetRequest, res: Response, next: NextFunction, id: BigInteger) => {
  User.findOne({ _id: id }).exec((err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("failed to load user " + id));
    }
    req.profile = user;
    next();
  });
};

export let showFollowers = (req: TweetRequest, res: Response) => {
  getshowFollowers(req, res, "followers");
};

export let showFollowing = (req: TweetRequest, res: Response) => {
  getshowFollowers(req, res, "following");
};

export let deleteTweet = (req: Request, res: Response) => {
  Tweet.remove({ user: req.user._id })
    .then(() => {
      User.findByIdAndRemove(req.user._id)
        .then(() => {
          return res.redirect("/login");
        })
        .catch(() => {
          res.render("pages/500");
        });
    })
    .catch(() => {
      res.render("pages/500");
    });
};


interface TweetRequest extends Request {
  profile: Object,
}

function getshowFollowers(req: TweetRequest, res: Response, type: string) {
  let user = req.profile;
  let followers = user[type];
  let tweetCount: BigInteger;
  let followingCount = user.following.length;
  let followerCount = user.followers.length;
  let userFollowers = User.find({ _id: { $in: followers } }).populate(
    "user",
    "_id name username github"
  );

  Tweet.countUserTweets(user._id).then(result => {
    tweetCount = result;
    userFollowers.exec((err, users) => {
      if (err) {
        return res.render("pages/500");
      }
      res.render("pages/followers", {
        user: user,
        followers: users,
        tweetCount: tweetCount,
        followerCount: followerCount,
        followingCount: followingCount
      });
    });
  });
}
