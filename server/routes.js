/*jslint node: true, nomen: true  */

var errors = require('./components/errors');

module.exports = function (app, config, passport) {
    'use strict';
    app.get("/", function (req, res) {
        console.log("Route handler for root path");
		if (req.isAuthenticated()) {
            console.log("User is authenticated: ", req.user);
            res.json({user : req.user});
		} else {
            console.log("User not authenticated, redirecting to /login");
			res.redirect("/login", {
                user : null
            });
		}
	});

//  LDAP "login" POST route
    
    app.post('/login', passport.authenticate('ldapauth', {session: true}), function (req, res) {
        console.log("/login POST processed");
        res.send({status: 'ok'});
    });
    /*
//  SAML "login" GET route
    
	app.get("/login",
        passport.authenticate(config.passport.strategy, {
            successRedirect : "/main",
            failureRedirect : "/login"
        })
        );
    
//  SAML "login/callback" POST route
    
	app.post('/login/callback', function (req, res) {
		passport.authenticate(config.passport.strategy,
			{
				failureRedirect: '/',
				failureFlash: true
			});
        res.redirect('/main');
    });
    */
    
//  "profile" route
    
	app.get("/profile", function (req, res) {
        if (req.isAuthenticated()) {
			res.json({ user : req.user });
        } else {
            res.redirect("/login");
	    }
	});
    
//  "logout" route
    
	app.get('/logout', function (req, res) {
        req.logout();
		// TODO: invalidate session on IP
		res.redirect('/');
	});

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
