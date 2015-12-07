/*jslint node: true, nomen: true  */

/**
 * Express configuration
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    config = require('./environment'),
    passport = require('passport'),
    morgan = require('morgan'),
    mongoose = require('mongoose');

module.exports = function (app) {

    'use strict';
    
    app.set('port', config.port);
    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(cookieParser(config.secrets.cookie));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    if (app.get('env') === 'production') {
        app.use(morgan('common', {
            skip        :       function (req, res) { return res.statusCode < 400; },
            stream      :       __dirname + '/../morgan.log'
        }));
    } else {
        app.use(morgan('dev'));
    }

//    if ('production' === env) {
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
//    }

//    if ('development' === env || 'test' === env) {
//        app.use(express.static(path.join(config.root, '.tmp')));
//        app.use(express.static(path.join(config.root, 'client')));
//        app.set('appPath', config.root + '/client');
//    }
};