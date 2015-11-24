/*jslint node: true, nomen: true  */

module.exports = function (app, handlers) {
    'use strict';
    
    var config          =   require('./config/environment'),
        errors          =   require('./components/errors'),
        passport        =   require('passport'),
        ActionModel     =   require('./api/action/action.model'),
        GroupModel      =   require('./api/group/group.model'),
        MilestoneModel  =   require('./api/milestone/milestone.model'),
        ObjectiveModel  =   require('./api/objective/objective.model'),
        PhaseModel      =   require('./api/phase/phase.model'),
        ProductModel    =   require('./api/product/product.model'),
        UserModel       =   require('./api/user/user.model');


    
// Default route
    
    app.get("/", function (req, res) {
        if (req.isAuthenticated()) {
            res.json({user : req.user});
        } else {
            res.redirect("/login", {
                user : null
            });
        }
    });

//  Login page
    
    app.get('/login', function (req, res) {
        passport.authenticate(config.passport.strategy, {
            successRedirect : "/",
            failureRedirect : "/login"
        });
    });

//  Login callback route (for callback from SAML authentication).
    
    app.post('/login/callback', function (req, res) {
        passport.authenticate(config.passport.strategy,
            {
                failureRedirect: '/',
                failureFlash: true
            });
        res.redirect('/');
    });

    app.get("/profile", function (req, res) {
        if (req.isAuthenticated()) {
            res.json({ user : req.user });
        } else {
            res.redirect("/login");
        }
    });

    app.get('/logout', function (req, res) {
        console.log('/logout get request received: ');
        req.logout();
        // TODO: invalidate session on IP
        res.redirect('/');
    });
    
// define API routes.
    
    app.use('/api/actions',     require('./api/action'));
    app.use('/api/groups',      require('./api/group'));
    app.use('/api/milestones',  require('./api/milestone'));
    app.use('/api/objectives',  require('./api/objective'));
    app.use('/api/phases',      require('./api/phase'));
    app.use('/api/products',    require('./api/product'));
    app.use('/api/users',       require('./api/user'));

/*
    //  Routes for Actions
    app.get('/api/actions/', handlers.getDocuments);
    app.get('/api/actions/:id', handlers.getDocument(req, res, ActionModel));
    app.post('/api/actions/', handlers.postDocument(req, res, ActionModel));
    app.put('/api/actions/:id', handlers.putDocument(req, res, ActionModel));
    app.delete('/api/actions/:id', handlers.deleteDocument(req, res, ActionModel));

    //  Routes for Groups
    app.get('/api/groups/', handlers.getDocuments(req, res, GroupModel));
    app.get('/api/groups/:id', handlers.getDocument(req, res, GroupModel));
    app.post('/api/groups/', handlers.postDocument(req, res, GroupModel));
    app.put('/api/groups/:id', handlers.putDocument(req, res, GroupModel));
    app.delete('/api/groups/:id', handlers.deleteDocument(req, res, GroupModel));

    //  Routes for Milestones
    app.get('/api/milestones/', handlers.getDocuments(req, res, MilestoneModel));
    app.get('/api/milestones/:id', handlers.getDocument(req, res, MilestoneModel));
    app.post('/api/milestones/', handlers.postDocument(req, res, MilestoneModel));
    app.put('/api/milestones/:id', handlers.putDocument(req, res, MilestoneModel));
    app.delete('/api/milestones/:id', handlers.deleteDocument(req, res, MilestoneModel));

    //  Routes for Objectives
    app.get('/api/objectives/', handlers.getDocuments(req, res, ObjectiveModel));
    app.get('/api/objectives/:id', handlers.getDocument(req, res, ObjectiveModel));
    app.post('/api/objectives/', handlers.postDocument(req, res, ObjectiveModel));
    app.put('/api/objectives/:id', handlers.putDocument(req, res, ObjectiveModel));
    app.delete('/api/objectives/:id', handlers.deleteDocument(req, res, ObjectiveModel));

    //  Routes for Phases
    app.get('/api/phases/', handlers.getDocuments(req, res, PhaseModel));
    app.get('/api/phases/:id', handlers.getDocument(req, res, PhaseModel));
    app.post('/api/phases/', handlers.postDocument(req, res, PhaseModel));
    app.put('/api/phases/:id', handlers.putDocument(req, res, PhaseModel));
    app.delete('/api/phases/:id', handlers.deleteDocument(req, res, PhaseModel));

    //  Routes for Products
    app.get('/api/products/', handlers.getDocuments(req, res, ProductModel));
    app.get('/api/products/:id', handlers.getDocument(req, res, ProductModel));
    app.post('/api/products/', handlers.postDocument(req, res, ProductModel));
    app.put('/api/products/:id', handlers.putDocument(req, res, ProductModel));
    app.delete('/api/products/:id', handlers.deleteDocument(req, res, ProductModel));

    //  Routes for Users
    app.get('/api/users/', handlers.getDocuments(req, res, UserModel));
    app.get('/api/users/:id', handlers.getDocument(req, res, UserModel));
    app.post('/api/users/', handlers.postDocument(req, res, UserModel));
    app.put('/api/users/:id', handlers.putDocument(req, res, UserModel));
    app.delete('/api/users/:id', handlers.deleteDocument(req, res, UserModel));
*/
    
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|vendor|node_modules|components)/*').get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*').get(function (req, res) {
        res.sendFile(app.get('appPath') + '/index.html');
    });

};