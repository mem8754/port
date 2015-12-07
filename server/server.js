/*jslint node: true, nomen: true  */

/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    env = process.env.NODE_ENV,
    config = require('./config/environment');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);
console.log('Mongo URI: ', config.mongo.uri);

require('./config/passport')(passport, config, db);

// Setup server
var app = express();

//  configure express parameters
require('./config/express')(app, config, passport);

//  configure session using mongoose for session storage

var MongoStore = require('connect-mongo')(session);

app.use(session({   key                 : 'app.sess',
                    store               : new MongoStore({ mongooseConnection: mongoose.connection }),
                    secret              : config.secrets.session,
                    resave              : false,
                    saveUninitialized   : false }));
                    
// configure session for passport
app.use(passport.initialize());
// app.use(passport.session());
app.use(methodOverride());

//  configure routes for http calls and for authentication interfaces
require('./routes')(app, config, passport);

// Start server
var server = require('http').createServer(app);
server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, env);
});

// Expose app
module.exports = app;