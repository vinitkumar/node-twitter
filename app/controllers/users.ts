import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Load user and append to req
 */
export const user = async (req: Request, res: Response, next: any, id: string) => {
  const User = mongoose.model('User');

  try {
    const user = await (User as any).load({ 
      criteria: { _id: id },
      select: 'name username github followers following'
    });
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
    const Tweet = mongoose.model('Tweet');
    const Analytics = mongoose.model('Analytics');
    
    const tweetCount = await Tweet.countDocuments();
    const userCount = await User.countDocuments();
    const analyticsCount = await Analytics.countDocuments();
    
    return res.render('pages/login', {
      errors: err.errors,
      user: user,
      tweetCount: tweetCount,
      userCount: userCount,
      analyticsCount: analyticsCount
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
    // Get tweet count
    const tweetCount = await Tweet.countDocuments({ user: user._id });
    
    // Get actual tweets for this user
    const tweets = await (Tweet as any)
      .list({
        criteria: { user: user._id },
        perPage: 20,
        page: 0
      })
      .exec();
    
    // Get follower/following counts
    const followerCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;
    
    res.render('pages/profile', {
      title: user.name,
      user: user,
      tweets: tweets,
      tweetCount: tweetCount,
      followerCount: followerCount,
      followingCount: followingCount
    });
  } catch (err) {
    res.render('pages/profile', {
      title: user.name,
      user: user,
      tweets: [],
      tweetCount: 0,
      followerCount: 0,
      followingCount: 0
    });
  }
};

/**
 * Show followers
 */
export const showFollowers = async (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const Tweet = mongoose.model('Tweet');
  const user = (req as any).profile;

  try {
    // Populate followers
    const populatedUser = await User.findById(user._id)
      .populate('followers', 'name username github')
      .exec();
    
    const followers = populatedUser?.followers || [];
    
    // Get counts for profile card
    const tweetCount = await Tweet.countDocuments({ user: user._id });
    const followerCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;
    
    res.render('pages/followers', {
      title: user.name + ' followers',
      user: user,
      followers: followers,
      tweetCount: tweetCount,
      followerCount: followerCount,
      followingCount: followingCount
    });
  } catch (err) {
    res.render('pages/followers', {
      title: user.name + ' followers',
      user: user,
      followers: [],
      tweetCount: 0,
      followerCount: 0,
      followingCount: 0
    });
  }
};

/**
 * Show following
 */
export const showFollowing = async (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const Tweet = mongoose.model('Tweet');
  const user = (req as any).profile;

  try {
    // Populate following
    const populatedUser = await User.findById(user._id)
      .populate('following', 'name username github')
      .exec();
    
    const following = populatedUser?.following || [];
    
    // Get counts for profile card
    const tweetCount = await Tweet.countDocuments({ user: user._id });
    const followerCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;
    
    res.render('pages/followers', {
      title: user.name + ' following',
      user: user,
      followers: following, // Using 'followers' template variable for both
      tweetCount: tweetCount,
      followerCount: followerCount,
      followingCount: followingCount
    });
  } catch (err) {
    res.render('pages/followers', {
      title: user.name + ' following',
      user: user,
      followers: [],
      tweetCount: 0,
      followerCount: 0,
      followingCount: 0
    });
  }
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
export const deleteUser = async (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const Tweet = mongoose.model('Tweet');
  const user = (req as any).profile;
  
  try {
    // Delete user's tweets
    await Tweet.deleteMany({ user: user._id });
    // Delete the user
    await User.findByIdAndDelete(user._id);
    // Logout and redirect
    req.logout((err: any) => {
      res.redirect('/login');
    });
  } catch (err) {
    res.redirect('/');
  }
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
export const login = async (req: Request, res: Response) => {
  const Tweet = mongoose.model('Tweet');
  const User = mongoose.model('User');
  const Analytics = mongoose.model('Analytics');

  try {
    const tweetCount = await Tweet.countDocuments();
    const userCount = await User.countDocuments();
    const analyticsCount = await Analytics.countDocuments();

    res.render('pages/login', {
      title: 'Login',
      tweetCount: tweetCount,
      userCount: userCount,
      analyticsCount: analyticsCount
    });
  } catch (err) {
    res.render('pages/login', {
      title: 'Login',
      tweetCount: 0,
      userCount: 0,
      analyticsCount: 0
    });
  }
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
