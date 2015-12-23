/*jslint node: true, nomen: true  */

/**
 **  Route middleware to ensure user is authenticated.
 **/
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    'use strict';
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(401);
};