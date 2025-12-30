import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Load user and append to req
 */
export const user = async (req: Request, res: Response, next: any, id: string) => {
  const User = mongoose.model('User');

  try {
    const user = await (User as any).load({ criteria: { _id: id } });
    if (!user) return next(new Error('Failed to load User ' + id));
    (req as any).profile = user;
    next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Create user
 */
export const create = async (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const user = new User((req as any).body);

  try {
    await user.save();
    req.logIn(user, (err: any) => {
      if (err) {
        return res.redirect('/users/' + user._id);
      }
      return res.redirect('/users/' + user._id);
    });
  } catch (err: any) {
    return res.render('pages/login', {
      errors: err.errors,
      user: user
    });
  }
};

/**
 * Show profile
 */
export const show = async (req: Request, res: Response) => {
  const Tweet = mongoose.model('Tweet');

  const user = (req as any).profile;

  try {
    const count = await Tweet.countDocuments({ user: (req as any).profile._id });
    res.render('pages/profile', {
      title: user.name,
      user: user,
      tweets: count
    });
  } catch (err) {
    res.render('pages/profile', {
      title: user.name,
      user: user,
      tweets: 0
    });
  }
};

/**
 * Show followers
 */
export const showFollowers = (req: Request, res: Response) => {
  const user = (req as any).profile;
  res.render('pages/followers', {
    title: user.name + ' followers',
    user: user
  });
};

/**
 * Show following
 */
export const showFollowing = (req: Request, res: Response) => {
  const user = (req as any).profile;
  res.render('pages/followers', {
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
  res.render('pages/login', {
    title: 'Login'
  });
};

/**
 * Signup page
 */
export const signup = (req: Request, res: Response) => {
  // Redirect to login since we use GitHub OAuth for authentication
  res.redirect('/login');
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
