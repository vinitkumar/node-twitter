import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Show analytics
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  const Analytics = mongoose.model('Analytics');
  const User = mongoose.model('User');
  const Tweet = mongoose.model('Tweet');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 50;

  try {
    const analytics = await (Analytics as any)
      .list({
        criteria: {},
        perPage: perPage,
        page: page
      })
      .exec();

    const pageViews = await Analytics.countDocuments();
    const userCount = await User.countDocuments();
    const tweetCount = await Tweet.countDocuments();

    res.render('pages/analytics', {
      title: 'Analytics',
      analytics: analytics || [],
      pageViews: pageViews,
      userCount: userCount,
      tweetCount: tweetCount,
      page: page,
      pages: Math.ceil(pageViews / perPage) || 1
    });
  } catch (err: any) {
    // On error, still render the page with empty analytics
    res.render('pages/analytics', {
      title: 'Analytics',
      analytics: [],
      pageViews: 0,
      userCount: 0,
      tweetCount: 0,
      page: 0,
      pages: 1
    });
  }
};
