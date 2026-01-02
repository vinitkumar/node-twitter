import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Show activities
 */
export const index = async (req: Request, res: Response) => {
  const Activity = mongoose.model('Activity');
  const page = parseInt((req as any).query.page) || 0;
  const perPage = 20;

  try {
    const activities = await (Activity as any)
      .list({
        criteria: {},
        perPage: perPage,
        page: page
      })
      .exec();

    res.render('pages/activity', {
      title: 'Activities',
      activities: activities || [],
      page: page,
      pages: Math.ceil(await Activity.countDocuments() / perPage) || 1
    });
  } catch (err) {
    res.render('pages/activity', {
      title: 'Activities',
      activities: [],
      page: 0,
      pages: 1
    });
  }
};
