/*jslint node: true, nomen: true  */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Create user
 * requires: {firstName, lastName, email, password}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
    'use strict';
    var newUser = new User(req.body);
    newUser.provider = 'local';

    newUser.save(function (err) {
        if (err) {
            return res.json(400, err);
        }

        req.logIn(newUser, function (err) {
            if (err) {
                return next(err);
            }
            return res.json(newUser.user_info);
        });
    });
};

/**
 *  Show profile for userId
 *  returns {firstName, lastName, email, groupId, admin, editor}
 */
exports.show = function (req, res, next) {
    'use strict';

    User.findById(req.params.userId, function (err, user) {
        if (err) {
            return next(new Error('Failed to load User'));
        }
        if (user) {
            res.send({ lastName   : user.lastName,
                       firstName  : user.firstName,
                       email      : user.email,
                       groupId    : user.groupId,
                       admin      : user.admin,
                       editor     : user.editor });
        } else {
            res.send(404, 'USER_NOT_FOUND');
        }
    });
};

/**
 *  Check if email exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
    'use strict';
    var email = req.params.email;
    User.findOne({ email : email }, function (err, user) {
        if (err) {
            return next(new Error('Failed to load User ' + email));
        }

        if (user) {
            if (user.approved) {
                res.json({exists: true});
            } else {
                return next(new Error('User ' + email + ' not yet approved for access.'));
            }
        } else {
            res.json({exists: false});
        }
    });
};