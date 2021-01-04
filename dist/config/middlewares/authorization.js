"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresLogin = (req, res, next) => {
    console.log('authenticated', req.isAuthenticated());
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};
/**
 * User authorization routing middleware
 */
exports.user = {
    hasAuthorization: (req, res, next) => {
        const user = req.user;
        const profile = req.profile;
        if (profile.id !== user.id) {
            return res.redirect('/users' + profile.id);
        }
        next();
    }
};
exports.tweet = {
    hasAuthorization: (req, res, next) => {
        const tweet = req.tweet;
        const user = req.user;
        if (tweet.user.id !== user.id) {
            return res.redirect('/tweets' + tweet.id);
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
        const user = req.user;
        const comment = req.comment;
        const article = req.article;
        if (user.id === comment.user.id || user.id === article.user.id) {
            next();
        }
        else {
            req.flash('info', 'You are not authorized');
            res.redirect('/articles/' + article.id);
        }
    }
};
//# sourceMappingURL=authorization.js.map