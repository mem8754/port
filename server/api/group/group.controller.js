/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /groups               ->  index
 * GET     /groups/:id           ->  show
 * POST    /groups               ->  create
 * PUT     /groups/:id           ->  update
 * DELETE  /groups/:id           ->  destroy
**/

'use strict';

var _ = require('lodash');
var Group = require('./group.model');

// Get list of Groups
exports.index = function (req, res) {
    
    // This controller handles a special format request. If the query parameter "opsGroups=true" is passed in, 
    // a custom query for groups which have the 'opsId' field set to a positive number is executed and those 
    // groups are returned (_id, opsId fields only).
    
    if (req.query.opsGroups) {
        Group.find({ 'opsId' : { $gt : 0 }}, { '_id': true, 'opsId': true}, function (err, groups) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(groups);
        });
    } else {
        Group.find(req.query, function (err, groups) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(groups);
        });
    }
};

// Get a single group by mongo _id
exports.show = function (req, res) {
    Group.findById(req.params.id, function (err, group) {
        if (err) { return handleError(res, err); }
        if (!group) { return res.send(404); }
        return res.status(200).json(group);
    });
};

// Creates a new group in the DB.
exports.create = function (req, res) {
    Group.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing group in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Group.findById(req.params.id, function (err, group) {
        if (err) { return handleError(res, err); }
        if (!group) { return res.send(404); }
        var updated = _.merge(group, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(group);
        });
    });
};

// Deletes a group from the DB.
exports.destroy = function (req, res) {
    Group.findById(req.params.id, function (err, group) {
        if (err) { return handleError(res, err); }
        if (!group) { return res.send(404); }
        group.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}