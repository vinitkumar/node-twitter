import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Load user and append to req
 */
export const user = (req: Request, res: Response, next: any, id: string) => {
  const User = mongoose.model('User');

  (User as any).load({ criteria: { _id: id } }, (err: any, user: any) => {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    (req as any).profile = user;
    next();
  });
};

/**
 * Create user
 */
export const create = (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const user = new User((req as any).body);

  user.save((err: any) => {
    if (err) {
      return res.render('users/signup', {
        errors: (err as any).errors,
        user: user
      });
    }
    req.logIn(user, (err: any) => {
      if (err) {
        return res.redirect('/users/' + user._id);
      }
      return res.redirect('/users/' + user._id);
    });
  });
};

/**
 * Show profile
 */
export const show = (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const Tweet = mongoose.model('Tweet');

  const user = (req as any).profile;

  (Tweet as any).countDocuments({ user: (req as any).profile._id }, (err: any, count: any) => {
    res.render('users/profile', {
      title: user.name,
      user: user,
      tweets: count
    });
  });
};

/**
 * Show followers
 */
export const showFollowers = (req: Request, res: Response) => {
  const user = (req as any).profile;
  res.render('users/followers', {
    title: user.name + ' followers',
    user: user
  });
};

/**
 * Show following
 */
export const showFollowing = (req: Request, res: Response) => {
  const user = (req as any).profile;
  res.render('users/following', {
    title: user.name + ' following',
    user: user
  });
};

/**
 * Update user
 */
export const update = (req: Request, res: Response) => {
  const user = (req as any).profile;
  // Implement update logic
  res.redirect('/users/' + user._id);
};

/**
 * Delete user
 */
export const deleteUser = (req: Request, res: Response) => {
  const user = (req as any).profile;
  // Implement delete logic
  res.redirect('/');
};

/**
 * Session
 */
export const session = (req: Request, res: Response) => {
  res.redirect('/');
};

/**
 * Login page
 */
export const login = (req: Request, res: Response) => {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Signup page
 */
export const signup = (req: Request, res: Response) => {
  res.render('users/signup', {
    title: 'Sign up'
  });
};

/**
 * Logout
 */
export const logout = (req: Request, res: Response) => {
  req.logout((err: any) => {
    res.redirect('/login');
  });
};

/**
 * Sign in
 */
export const signin = (req: Request, res: Response) => {
  res.redirect('/');
};

/**
 * Auth callback
 */
export const authCallback = (req: Request, res: Response) => {
  res.redirect('/');
};
