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
    mongoose = require('mongoose');

module.exports = function (app) {

    'use strict';
    
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    if ('production' === env) {
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', config.root + '/client');
    }

    if ('development' === env || 'test' === env) {
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', config.root + '/client');

    }
};