import { Request, Response } from 'express';

/**
 * Create comment
 */
export const create = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Comment created' });
};

/**
 * Destroy comment
 */
export const destroy = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Comment destroyed' });
};
