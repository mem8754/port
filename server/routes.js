/**
 * Main application routes
 */

/*jslint node: true, nomen: true  */
/*global angular */

var errors = require('./components/errors'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override');

module.exports = function (app) {
    'use strict';

// parse application/json 
    app.use(bodyParser.json());

// parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

// parse cookies with cookie-parser and cookieSecret
//    app.use(cookieParser(credentials.cookieSecret));

// define API routes.
    app.use('/api/actions', require('./api/action'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/groups', require('./api/group'));
    app.use('/api/milestones', require('./api/milestone'));
    app.use('/api/objectives', require('./api/objective'));
    app.use('/api/phases', require('./api/phase'));
    app.use('/api/products', require('./api/product'));

// All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|vendor|node_modules|components)/*')
        .get(errors[404]);

// All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendFile(app.get('appPath') + '/index.html');
        });
};
