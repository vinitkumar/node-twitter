import { Request, Response } from 'express';

/**
 * Create favorite
 */
export const create = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Favorite created' });
};

/**
 * Destroy favorite
 */
export const destroy = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Favorite destroyed' });
};
