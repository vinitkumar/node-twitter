import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * List tweets API
 */
export const tweetList = (req: Request, res: Response) => {
  const Tweet = mongoose.model('Tweet');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 10;

  Tweet.list({
    criteria: {},
    perPage: perPage,
    page: page
  })
    .exec((err: any, tweets: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json(tweets);
    });
};

/**
 * List users API
 */
export const usersList = (req: Request, res: Response) => {
  const User = mongoose.model('User');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 10;

  User.list({
    criteria: {},
    perPage: perPage,
    page: page
  })
    .exec((err: any, users: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json(users);
    });
};
