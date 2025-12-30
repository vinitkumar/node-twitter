import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * List tweets API
 */
export const tweetList = async (req: Request, res: Response): Promise<void> => {
  const Tweet = mongoose.model('Tweet');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 10;

  try {
    const tweets = await (Tweet as any)
      .list({
        criteria: {},
        perPage: perPage,
        page: page
      })
      .exec();
    res.json(tweets);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * List users API
 */
export const usersList = async (req: Request, res: Response): Promise<void> => {
  const User = mongoose.model('User');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 10;

  try {
    const users = await (User as any)
      .list({
        criteria: {},
        perPage: perPage,
        page: page
      })
      .exec();
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
