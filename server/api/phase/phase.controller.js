/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /phases               ->  index
 * GET     /phases/:id           ->  show
 * POST    /phases               ->  create
 * PUT     /phases/:id           ->  update
 * DELETE  /phases/:id           ->  destroy
**/

'use strict';

var _ = require('lodash');
var Phase = require('./phase.model');

// Get list of Phases
exports.index = function (req, res) {
    Phase.find(req.query, function (err, phases) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(phases);
    });
};

// Get a single phase by mongo _id
exports.show = function (req, res) {
    Phase.findById(req.params.id, function (err, phase) {
        if (err) { return handleError(res, err); }
        if (!phase) { return res.send(404); }
        return res.status(200).json(phase);
    });
};

// Creates a new phase in the DB.
exports.create = function (req, res) {
    Phase.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing phase in the DB.
exports.update = function (req, res) {
    console.log('Revisions: ', req.body.status);
    if (req.body._id) { delete req.body._id; }
    Phase.findById(req.params.id, function (err, phase) {
        if (err) { return handleError(res, err); }
        if (!phase) { return res.send(404); }
        console.log('Original: ', phase.status);
        var updated = _.merge(phase, req.body);
        console.log('Revisions: ', req.body.status);
        console.log('Original: ', phase.status);
        console.log('Updated: ', updated.status);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(phase);
        });
    });
};

// Deletes a phase from the DB.
exports.destroy = function (req, res) {
    Phase.findById(req.params.id, function (err, phase) {
        if (err) { return handleError(res, err); }
        if (!phase) { return res.send(404); }
        phase.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}