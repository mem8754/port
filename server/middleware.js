/*jslint node: true, nomen: true  */

module.exports = function middlewareInit(app) {
    'use strict';
    
    var express             =   require('express'),
        mongoose            =   require('mongoose'),
        session             =   require('express-session'),
        bodyParser          =   require('body-parser'),
        cookieParser        =   require('cookie-parser'),
        methodOverride      =   require('method-override'),
        path                =   require('path'),
        passport            =   require('passport'),
        config              =   require('./config/environment'),
        passportInit        =   require('./config/passport'),
        MongoStore          =   require('connect-mongo')(session),

// Connect to database
                
        db                  =   mongoose.connect(config.mongo.uri, config.mongo.options);
    
    console.log('Mongo URI: ', config.mongo.uri);

    passportInit(db);

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');

    //  configure session using mongoose for session storage
    app.use(session({
        key: 'app.sess',
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        secret: config.secrets.session,
        resave: false,
        saveUninitialized: false
    }));

    // configure session for passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride());
    app.use(methodOverride('X-HTTP-Method-Override'));

};