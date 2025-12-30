import { Request, Response } from 'express';

/**
 * Show analytics
 */
export const index = (req: Request, res: Response) => {
  res.render('analytics/index', { title: 'Analytics' });
};
