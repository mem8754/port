/*jslint node: true, nomen: true  */

var     passport    =   require('passport');
var     config      =   require('./config/environment');

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
 *  re-routes to SAML site for authentication.
 */

exports.login = function (req, res, next) {
    'use strict';
    passport.authenticate(config.passport.strategy, {
        successRedirect : "/",
        failureRedirect : "/login"
    });

    passport.authenticate(config.passport.strategy, function (err, user, info) {
        var error = err || info;
        if (error) {
            return res.json(400, error);
        }
        req.logIn(user, function (err) {
            if (err) { return res.send(err); }
            res.json(req.user.user_info);
        });
    })(req, res, next);
};