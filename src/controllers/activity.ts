import mongoose from "mongoose";
const Activity = mongoose.model("Activity");
import { Response, Request, NextFunction } from "express";

exports.index = (req: Request, res: Response) => {
  let activities;
  let options = {};
  Activity.list(options).then(result => {
    activities = result;
    return res.render("pages/activity", {
      activities: activities
    });
  });
};
