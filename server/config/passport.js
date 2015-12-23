/*jslint node: true, nomen: true  */

var config = require('./environment'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

module.exports = function (passport) {
    'use strict';
    
    passport.serializeUser(function (user, done) {
        console.log('passport.serializeUser: ' + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log('passport.deserializeUser: ' + id);
        User.findOne({ _id: id }, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        {
            usernameField   :   'email',
            passwordField   :   'password'
        },
        function (email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null,
                                false,
                                { 'errors': { 'email': { type: 'Email is not registered.' } } });
                }
                
                if (!user.authenticate(password)) {
                    return done(null, false,
                                { 'errors': { 'password': { type: 'Password is incorrect.' } } });
                }
                
                return done(null, user);
            });
        }
    ));
};