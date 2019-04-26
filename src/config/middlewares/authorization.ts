/**
 * Generic require login routing middlewares
 */
import { Response, Request, NextFunction } from "express";

export let requiresLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

/**
 * User authorization routing middleware
 */

interface userObject extends Object {
  id: string,
}


interface tweetObject extends Object {
  user: userObject,
  id: string,
}

interface commentObject extends Object {
  user: userObject,
  id: string,
}
interface TweetRequest extends Request {
  profile: userObject,
  tweet: tweetObject,
  comment: commentObject,

}


export let user = {
  hasAuthorization: (req: TweetRequest, res: Response, next: NextFunction) => {
    if (req.profile.id != req.user.id) {
      return res.redirect('/users'+req.profile.id);
    }
    next();
  }
};

export let tweet = {
  hasAuthorization: (req: TweetRequest, res: Response, next: NextFunction) => {
    if (req.tweet.user.id != req.user.id) {
      return res.redirect('/tweets'+req.tweet.id);
    }
    next();
  }
};


/**
 * Comment authorization routing middleware
 */

export let comment = {
  hasAuthorization: (req: TweetRequest, res: Response, next: NextFunction) => {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
    }
  }
};
