import { Response, Request, NextFunction } from "express";
// ### Create Favorite
export let create = (req: Request, res: Response) => {
  const tweet = req.tweet;
  tweet._favorites = req.user;
  tweet.save(err => {
    if (err) {
      return res.send(400);
    }
    res.send(201, {});
  });
};

// ### Delete Favorite
export let destroy = (req: Request, res: Response) => {
  const tweet = req.tweet;

  tweet._favorites = req.user;
  tweet.save(err => {
    if (err) {
      return res.send(400);
    }
    res.send(200);
  });
};
