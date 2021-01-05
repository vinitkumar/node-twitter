/**
 * Generic require login routing middlewares
 */
import {Request, Response, NextFunction} from "express";
import {UserDocument} from "../../models/user";
import {CommentDocument, TweetDocument} from "../../models/tweets";

import {CustomRequest} from "../middlewares/logger";


exports.requiresLogin = (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log('authenticated', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

/**
 * User authorization routing middleware
 */

exports.user = {
  hasAuthorization: (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const profile = req.profile as UserDocument;
    if (profile.id !== user.id) {
      return res.redirect('/users'+ profile.id);
    }
    next();
  }
};

exports.tweet = {
  hasAuthorization: (req: CustomRequest, res: Response, next: NextFunction) => {
    const tweet = req.tweet as TweetDocument;
    const user = req.user as UserDocument;
    if (tweet.user.id !== user.id) {
      return res.redirect('/tweets'+tweet.id);
    }
    next();
  }
};


/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: (req: CustomRequest, res: Response, next: NextFunction)  => {
    // if the current user is comment owner or article owner
    // give them authority to delete
    const user = req.user as UserDocument;
    const comment = req.comment as CommentDocument;
    const article = req.article as TweetDocument;
    if (user.id === comment.user.id || user.id === article.user.id) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
      res.redirect('/articles/' + article.id);
    }
  }
};
