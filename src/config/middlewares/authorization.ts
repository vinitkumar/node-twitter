/**
 * Generic require login routing middlewares
 */
import {Request, Response, NextFunction} from "express";

exports.requiresLogin = (req: Request, res: Response, next: NextFunction) => {
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
  hasAuthorization: (req: Request, res: Response, next: NextFunction) => {
    if (req.profile.id !== req.user.id) {
      return res.redirect('/users'+req.profile.id);
    }
    next();
  }
};

exports.tweet = {
  hasAuthorization: (req: Request, res: Response, next: NextFunction) => {
    if (req.tweet.user.id !== req.user.id) {
      return res.redirect('/tweets'+req.tweet.id);
    }
    next();
  }
};


/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: (req: Request, res: Response, next: NextFunction)  => {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
      res.redirect('/articles/' + req.article.id);
    }
  }
};
