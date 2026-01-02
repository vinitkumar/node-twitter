import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Load tweet
 */
export const tweet = async (req: Request, res: Response, next: any, id: string): Promise<void> => {
  const Tweet = mongoose.model('Tweet');

  try {
    const tweet = await (Tweet as any).load(id);
    if (!tweet) return next(new Error('Failed to load Tweet ' + id));
    (req as any).tweet = tweet;
    next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Create tweet
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  const Tweet = mongoose.model('Tweet');
  const tweet = new Tweet((req as any).body);
  tweet.user = (req as any).user;

  try {
    await tweet.save();
    res.redirect('/');
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update tweet
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  const tweet = (req as any).tweet;
  Object.assign(tweet, (req as any).body);

  try {
    await tweet.save();
    res.redirect('/');
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Destroy tweet
 */
export const destroy = async (req: Request, res: Response): Promise<void> => {
  const tweet = (req as any).tweet;

  try {
    await tweet.deleteOne();
    res.redirect('/');
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Show tweet
 */
export const show = (req: Request, res: Response): void => {
  res.render('components/tweet', {
    title: 'Tweet',
    tweet: (req as any).tweet
  });
};

/**
 * List tweets
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  const Tweet = mongoose.model('Tweet');
  const Analytics = mongoose.model('Analytics');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 10;

  try {
    const user = (req as any).user;
    const tweets = await (Tweet as any)
      .list({
        criteria: {},
        perPage: perPage,
        page: page
      })
      .exec();
    
    // Get recent visits/analytics
    const analytics = await (Analytics as any)
      .list({
        criteria: {},
        perPage: 10,
        page: 0
      })
      .exec();
    
    // Get tweet count for current user
    const tweetCount = await Tweet.countDocuments({ user: user._id });
    const followerCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;
    
    res.render('pages/index', {
      title: 'Tweets',
      tweets: tweets,
      analytics: analytics,
      tweetCount: tweetCount,
      followerCount: followerCount,
      followingCount: followingCount,
      page: page,
      pages: Math.ceil(await Tweet.countDocuments() / perPage)
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Find tweets by tag
 */
export const findTag = async (req: Request, res: Response): Promise<void> => {
  const Tweet = mongoose.model('Tweet');
  const Analytics = mongoose.model('Analytics');
  const tag = (req as any).params.tag;

  try {
    const user = (req as any).user;
    const tweets = await (Tweet as any)
      .list({
        criteria: { tags: tag },
        perPage: 10,
        page: 0
      })
      .exec();
    
    const analytics = await (Analytics as any)
      .list({
        criteria: {},
        perPage: 10,
        page: 0
      })
      .exec();
    
    const tweetCount = await Tweet.countDocuments({ user: user._id });
    const followerCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;
    
    res.render('pages/index', {
      title: 'Tweets tagged with ' + tag,
      tweets: tweets,
      analytics: analytics,
      tweetCount: tweetCount,
      followerCount: followerCount,
      followingCount: followingCount,
      page: 0,
      pages: 1
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
