import mongoose from "mongoose";
import {Request, Response} from "express";
const Activity = mongoose.model("Activity");

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
