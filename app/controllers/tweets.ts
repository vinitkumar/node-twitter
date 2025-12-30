import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Load tweet
 */
export const tweet = (req: Request, res: Response, next: any, id: string): void => {
  const Tweet = mongoose.model('Tweet');

  (Tweet as any).load(id, (err: any, tweet: any) => {
    if (err) return next(err);
    if (!tweet) return next(new Error('Failed to load Tweet ' + id));
    (req as any).tweet = tweet;
    next();
  });
};

/**
 * Create tweet
 */
export const create = (req: Request, res: Response): void => {
  const Tweet = mongoose.model('Tweet');
  const tweet = new Tweet((req as any).body);
  tweet.user = (req as any).user;

  tweet.save((err: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.redirect('/tweets/' + tweet._id);
  });
};

/**
 * Update tweet
 */
export const update = (req: Request, res: Response): void => {
  const tweet = (req as any).tweet;
  Object.assign(tweet, (req as any).body);

  tweet.save((err: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.redirect('/tweets/' + tweet._id);
  });
};

/**
 * Destroy tweet
 */
export const destroy = (req: Request, res: Response): void => {
  const tweet = (req as any).tweet;

  tweet.deleteOne((err: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.redirect('/');
  });
};

/**
 * Show tweet
 */
export const show = (req: Request, res: Response): void => {
  res.render('tweets/show', {
    title: 'Tweet',
    tweet: (req as any).tweet
  });
};

/**
 * List tweets
 */
export const index = (req: Request, res: Response): void => {
  const Tweet = mongoose.model('Tweet');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 10;

  (Tweet as any)
    .list({
      criteria: {},
      perPage: perPage,
      page: page
    })
    .exec((err: any, tweets: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.render('tweets/index', {
        title: 'Tweets',
        tweets: tweets
      });
    });
};

/**
 * Find tweets by tag
 */
export const findTag = (req: Request, res: Response): void => {
  const Tweet = mongoose.model('Tweet');
  const tag = (req as any).params.tag;

  (Tweet as any)
    .list({
      criteria: { tags: tag },
      perPage: 10,
      page: 0
    })
    .exec((err: any, tweets: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.render('tweets/index', {
        title: 'Tweets tagged with ' + tag,
        tweets: tweets
      });
    });
};
