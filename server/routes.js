/*jslint node: true, nomen: true  */

module.exports = function (app, config, passport) {
    'use strict';

    var errors = require('./components/errors'),
        users = require('./controllers/users'),
        auth = require('./config/auth'),
        session = require('./controllers/session');
    
    // User Routes
    app.post('/auth/users', users.create);
    app.get('/auth/users/:userId', users.show);

    // Check if email is available
    app.get('/auth/check_email/:email', users.exists);

    // Session Routes
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);


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
