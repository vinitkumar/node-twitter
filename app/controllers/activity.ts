import { Request, Response } from 'express';

/**
 * Show activities
 */
export const index = (req: Request, res: Response) => {
  res.render('pages/activity', { title: 'Activities' });
};
