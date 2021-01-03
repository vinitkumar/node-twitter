import mongoose from "mongoose";
const Activity = mongoose.model("Activity");

import {Request, Response} from "express";

exports.index = (req: Request, res: Response) => {
  let activities;
  let options = {};
  Activity.list(options).then(function (result:any) {
    activities = result;
    return res.render("pages/activity", {
      activities: activities
    });
  });
};
