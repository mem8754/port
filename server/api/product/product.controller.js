/*jslint node: true, nomen: true, plusplus: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /products               ->  index
 * GET     /products/:id           ->  show
 * POST    /products               ->  create
 * PUT     /products/:id           ->  update
 * DELETE  /products/:id           ->  destroy
**/

'use strict';

var _ = require('lodash');
var Product = require('./product.model');

// Get list of Products
exports.index = function (req, res) {
    Product.find(req.query, function (err, products) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(products);
    });
};

// Get a single product by mongo _id
exports.show = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) { return handleError(res, err); }
        if (!product) { return res.send(404); }
        return res.status(200).json(product);
    });
};

// Creates a new product in the DB.
exports.create = function (req, res) {
    Product.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing product in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Product.findById(req.params.id, function (err, product) {
        if (err) { return handleError(res, err); }
        if (!product) { return res.send(404); }
        var updated = _.merge(product, req.body);
        Product.findOneAndUpdate({ _id : req.params.id }, { $set : updated }, { upsert : false }, function (err, affected, raw) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(affected);
        });
    });
};

// Deletes a product from the DB.
exports.destroy = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) { return handleError(res, err); }
        if (!product) { return res.send(404); }
        product.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}