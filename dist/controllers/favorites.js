"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ### Create Favorite
exports.create = (req, res) => {
    const tweet = req.tweet;
    tweet._favorites = req.user;
    tweet.save(function (err) {
        if (err) {
            return res.send(400);
        }
        res.send(201, {});
    });
};
// ### Delete Favorite
exports.destroy = (req, res) => {
    const tweet = req.tweet;
    tweet._favorites = req.user;
    tweet.save(function (err) {
        if (err) {
            return res.send(400);
        }
        res.send(200);
    });
};
//# sourceMappingURL=favorites.js.map