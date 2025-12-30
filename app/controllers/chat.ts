import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Show chats
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  const User = mongoose.model('User');
  const Chat = mongoose.model('Chat');

  try {
    const users = await (User as any)
      .list({
        criteria: {},
        perPage: 20,
        page: 0
      })
      .exec();

    res.render('chat/index', {
      title: 'Chats',
      users: users
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Show single chat
 */
export const show = async (req: Request, res: Response): Promise<void> => {
  const Chat = mongoose.model('Chat');
  const chatId = (req as any).params.id;

  try {
    const chat = await (Chat as any).load({ criteria: { _id: chatId } });
    res.render('chat/chat', {
      title: 'Chat',
      chat: chat
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get chat
 */
export const getChat = async (req: Request, res: Response): Promise<void> => {
  const Chat = mongoose.model('Chat');
  const userId = (req as any).params.userid;
  const currentUser = (req as any).user;

  try {
    const chats = await (Chat as any)
      .list({
        criteria: {
          $or: [
            { sender: currentUser._id, receiver: userId },
            { sender: userId, receiver: currentUser._id }
          ]
        },
        perPage: 50,
        page: 0
      })
      .exec();

    res.json(chats);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Create chat
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  const Chat = mongoose.model('Chat');
  const chat = new Chat({
    message: (req as any).body.message,
    sender: (req as any).user._id,
    receiver: (req as any).body.receiver
  });

  try {
    await chat.save();
    res.status(201).json(chat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
