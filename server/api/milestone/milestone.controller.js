/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /milestones               ->  index
 * GET     /milestones/:id           ->  show
 * POST    /milestones               ->  create
 * PUT     /milestones/:id           ->  update
 * DELETE  /milestones/:id           ->  destroy
**/

'use strict';

var _ = require('lodash');
var Milestone = require('./milestone.model');

// Get list of Milestones
exports.index = function (req, res) {
    Milestone.find(req.query, function (err, milestones) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(milestones);
    });
};

// Get a single milestone by mongo _id
exports.show = function (req, res) {
    Milestone.findById(req.params.id, function (err, milestone) {
        if (err) { return handleError(res, err); }
        if (!milestone) { return res.send(404); }
        return res.status(200).json(milestone);
    });
};

// Creates a new milestone in the DB.
exports.create = function (req, res) {
    Milestone.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing milestone in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Milestone.findById(req.params.id, function (err, milestone) {
        if (err) { return handleError(res, err); }
        if (!milestone) { return res.send(404); }
        var updated = _.merge(milestone, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(milestone);
        });
    });
};

// Deletes a milestone from the DB.
exports.destroy = function (req, res) {
    Milestone.findById(req.params.id, function (err, milestone) {
        if (err) { return handleError(res, err); }
        if (!milestone) { return res.send(404); }
        milestone.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}