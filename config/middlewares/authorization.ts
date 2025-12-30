import { Request, Response, NextFunction } from 'express';

/**
 * Generic require login routing middlewares
 */
export const requiresLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('authenticated', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    res.redirect('/login');
    return;
  }
  next();
};

/**
 * User authorization routing middleware
 */
export const user = {
  hasAuthorization: (req: Request, res: Response, next: NextFunction): void => {
    if ((req as any).profile.id !== (req as any).user.id) {
      res.redirect('/users' + (req as any).profile.id);
      return;
    }
    next();
  }
};

export const tweet = {
  hasAuthorization: (req: Request, res: Response, next: NextFunction): void => {
    if ((req as any).tweet.user.id !== (req as any).user.id) {
      res.redirect('/tweets' + (req as any).tweet.id);
      return;
    }
    next();
  }
};

/**
 * Comment authorization routing middleware
 */
export const comment = {
  hasAuthorization: (req: Request, res: Response, next: NextFunction): void => {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (
      (req as any).user.id === (req as any).comment.user.id ||
      (req as any).user.id === (req as any).article.user.id
    ) {
      next();
    } else {
      (req as any).flash('info', 'You are not authorized');
      res.redirect('/articles/' + (req as any).article.id);
    }
  }
};
