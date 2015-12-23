/*jslint node: true, nomen: true  */

var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Session
 * returns info on authenticated user
 */
exports.session = function (req, res) {
    'use strict';
    res.json(req.user.user_info);
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
    'use strict';
    if (req.user) {
        req.logout();
        res.send(200);
    } else {
        res.send(400, "Not logged in");
    }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
    'use strict';
    passport.authenticate('local', function (err, user, info) {
        var error = err || info,
            approval_err = { errors : { email : { type : "User not yet approved by Administrator." }}};

        if (error) {
            return res.json(400, error);
        }
        
        if (!user.approved) {
            error = approval_err;
            user = null;
            return res.json(400, error);
        }
        
        req.logIn(user, function (err) {
            if (err) {
                return res.send(err);
            }
            res.json(req.user.user_info);
        });
    })(req, res, next);
};