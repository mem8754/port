/*jslint node: true, nomen: true  */

/** Main application file - alternate implementation */

'use strict';

//  Set default application environment to "development"

process.env.NODE_ENV    =   process.env.NODE_ENV || 'development';

var express             =   require('express'),
    app                 =   express(),
    server              =   require('http').createServer(app),
    handlers            =   require('./handlers'),
    middlewareInit      =   require('./middleware'),
    config              =   require('./config/environment');

middlewareInit();

require('./routez')(app, config);

// Start server

server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
module.exports = app;