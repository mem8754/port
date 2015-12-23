/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /actions               ->  index
 * GET     /actions/:id           ->  show
 * POST    /actions               ->  create
 * PUT     /actions/:id           ->  update
 * DELETE  /actions/:id           ->  destroy
**/

'use strict';

var _ = require('lodash'),
    Action = require('./action.model');

// Get list of Actions
exports.index = function (req, res) {
    Action.find(req.query, function (err, actions) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(actions);
    });
};

// Get a single action by mongo _id
exports.show = function (req, res) {
    Action.findById(req.params.id, function (err, action) {
        if (err) { return handleError(res, err); }
        if (!action) { return res.send(404); }
        return res.status(200).json(action);
    });
};

// Creates a new action in the DB.
exports.create = function (req, res) {
    Action.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing action in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Action.findById(req.params.id, function (err, action) {
        if (err) { return handleError(res, err); }
        if (!action) { return res.send(404); }
        var updated = _.merge(action, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(action);
        });
    });
};

// Deletes a action from the DB.
exports.destroy = function (req, res) {
    Action.findById(req.params.id, function (err, action) {
        if (err) { return handleError(res, err); }
        if (!action) { return res.send(404); }
        action.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}