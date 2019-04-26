"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};
exports.user = {
    hasAuthorization: (req, res, next) => {
        if (req.profile.id != req.user.id) {
            return res.redirect('/users' + req.profile.id);
        }
        next();
    }
};
exports.tweet = {
    hasAuthorization: (req, res, next) => {
        if (req.tweet.user.id != req.user.id) {
            return res.redirect('/tweets' + req.tweet.id);
        }
        next();
    }
};
/**
 * Comment authorization routing middleware
 */
exports.comment = {
    hasAuthorization: (req, res, next) => {
        // if the current user is comment owner or article owner
        // give them authority to delete
        if (req.user.id === req.comment.user.id) {
            next();
        }
        else {
            req.flash('info', 'You are not authorized');
        }
    }
};
//# sourceMappingURL=authorization.js.map