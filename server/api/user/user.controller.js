/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /users                ->  index
 * GET     /users/:id            ->  show
 * POST    /users                ->  create
 * PUT     /users/:id            ->  update
 * DELETE  /users/:id            ->  destroy
 *
 * GET     /users/byEmail/:email ->  findByEmail
 */

'use strict';

var _ = require('lodash');
var User = require('./user.model');

// Get list of users
exports.index = function (req, res) {
    User.find(req.query, function (err, users) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(users);
    });
};

// Get a single user by mongo _id
exports.show = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) { return handleError(res, err); }
        if (!user) { return res.send(404); }
        return res.status(200).json(user);
    });
};

// Creates a new user in the DB.
exports.create = function (req, res) {
    User.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing user in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    User.findById(req.params.id, function (err, user) {
        if (err) { return handleError(res, err); }
        if (!user) { return res.send(404); }
        var updated = _.merge(user, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(user);
        });
    });
};

// Deletes a user from the DB.
exports.destroy = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) { return handleError(res, err); }
        if (!user) { return res.send(404); }
        user.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

// Get user by email - should just return one, but return an array anyway.

exports.findByEmail = function (req, res) {
    User.find({ email : req.params.email }, function (err, users) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(users);
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}