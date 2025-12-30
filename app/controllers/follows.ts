import { Request, Response } from 'express';

/**
 * Follow user
 */
export const follow = (req: Request, res: Response) => {
  res.status(200).json({ message: 'User followed' });
};
