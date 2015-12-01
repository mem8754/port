/*jslint node: true, nomen: true  */
/*global angular */

var _               =   require('lodash'),
    Model           =   '';


function handleError(res, err) {
    'use strict';
    return res.status(500).send(err);
}

//  Get all Documents from specified collection

exports.getDocuments = function (req, res, Model) {
    'use strict';
    Model.find(req.query, function (err, documents) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(documents);
    });
};

//  Get a single document from specified collection by mongo _id

exports.getDocument = function (req, res, Model) {
    'use strict';
    Model.findById(req.params.id, function (err, document) {
        if (err) { return handleError(res, err); }
        if (!document) { return res.send(404); }
        return res.status(200).json(document);
    });
};

//  Create a new document in the specified collection. 
//  Provide an array of documents to post multiple documents at once.

exports.postDocument = function (req, res, Model) {
    'use strict';
    Model.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Update an existing document in the specified collection

exports.putDocument = function (req, res, Model) {
    'use strict';
    if (req.body._id) { delete req.body._id; }
    Model.findById(req.params.id, function (err, document) {
        if (err) { return handleError(res, err); }
        if (!document) { return res.send(404); }
        var updated = _.merge(document, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(document);
        });
    });
};

// Deletes a document from the specified collection

exports.deleteDocument = function (req, res, Model) {
    'use strict';
    Model.findById(req.params.id, function (err, document) {
        if (err) { return handleError(res, err); }
        if (!document) { return res.send(404); }
        document.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};