import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../../app/middlewares/logger';

export const analytics = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const Analytics = mongoose.model('Analytics');

  // A lot of analytics is missed because users might have
  // malformed IPs. Let's just get rid of the IP data altogether and log user irrespective
  // of that. For backward compatibility, we will just store a dummy IP for all future users.
  // This will also result in lesser code both in complexity and in line count.
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  // cleanup IP to remove unwanted characters
  const cleanIp = '129.23.12.1';

  Analytics.findOne({ user: (req as any).user })
    .sort({ createdAt: -1 })
    .exec((err: any, analytics: any) => {
      const date = new Date();
      if (analytics !== null) {
        if (new Date(analytics.createdAt).getDate() !== date.getDate()) {
          if (req.get('host')?.split(':')[0] !== 'localhost') {
            const newAnalytics = new Analytics({
              ip: cleanIp,
              user: (req as any).user,
              url: url
            });
            newAnalytics.save((err: any) => {
              if (err) {
                logger.log(err);
              }
            });
          }
        } else {
          logger.log('Not creating a new analytics entry on the same day');
        }
      } else {
        // it means this user is a new user and do not have a analytics object yet
        if (req.get('host')?.split(':')[0] !== 'localhost') {
          const newAnalytics = new Analytics({
            ip: cleanIp,
            user: (req as any).user,
            url: url
          });
          newAnalytics.save((err: any) => {
            if (err) {
              logger.log(err);
            }
          });
        }
      }
    });
  next();
};
