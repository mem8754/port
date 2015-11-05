/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /objectives               ->  index
 * GET     /objectives/:id           ->  show
 * POST    /objectives               ->  create
 * PUT     /objectives/:id           ->  update
 * DELETE  /objectives/:id           ->  destroy
**/

'use strict';

var _ = require('lodash');
var Objective = require('./objective.model');

// Get list of Objectives
exports.index = function (req, res) {
    Objective.find(req.query, function (err, objectives) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(objectives);
    });
};

// Get a single objective by mongo _id
exports.show = function (req, res) {
    Objective.findById(req.params.id, function (err, objective) {
        if (err) { return handleError(res, err); }
        if (!objective) { return res.send(404); }
        return res.status(200).json(objective);
    });
};

// Creates a new objective in the DB.
exports.create = function (req, res) {
    Objective.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing objective in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Objective.findById(req.params.id, function (err, objective) {
        if (err) { return handleError(res, err); }
        if (!objective) { return res.send(404); }
        var updated = _.merge(objective, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(objective);
        });
    });
};

// Deletes a objective from the DB.
exports.destroy = function (req, res) {
    Objective.findById(req.params.id, function (err, objective) {
        if (err) { return handleError(res, err); }
        if (!objective) { return res.send(404); }
        objective.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}