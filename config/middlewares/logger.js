const mongoose = require("mongoose");
const Analytics = mongoose.model("Analytics");

exports.analytics = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  if (req.ip !== undefined) {
    const crudeIpArray = req.ip.split(":");
    const ipArrayLength = crudeIpArray.length;
    // cleanup IP to remove unwanted characters
    const cleanIp = crudeIpArray[ipArrayLength - 1];
    if (req.get("host").split(":")[0] !== "localhost") {
      const analytics = new Analytics({
        ip: cleanIp,
        user: req.user,
        url: url
      });
      analytics.save(err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
  next();
};
