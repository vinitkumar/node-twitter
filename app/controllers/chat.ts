import { Request, Response } from 'express';

/**
 * Show chats
 */
export const index = (req: Request, res: Response) => {
  res.render('chat/index', { title: 'Chats' });
};

/**
 * Show single chat
 */
export const show = (req: Request, res: Response) => {
  res.render('chat/show', { title: 'Chat' });
};

/**
 * Get chat
 */
export const getChat = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Chat' });
};

/**
 * Create chat
 */
export const create = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Chat created' });
};
