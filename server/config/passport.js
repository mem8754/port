/*jslint node: true, nomen: true  */

var passport = require('passport'),
    SamlStrategy = require('passport-saml').Strategy,
    config = require('./environment');

module.exports = function (db) {
    'use strict';

    passport.serializeUser(function (user, done) {
        db.collection('users').find({email: user.email}).toArray(function (err, result) {
            if (result.length === 0) {
                //  User is not in the database, add the user.
                var insertData = [{email: user.email, firstName: user.givenName, lastName: user.sn}];
                db.collection('users').insert(insertData, function (err, result) {
                    done(null, insertData);
                });
            } else {
                //  User is already in the database, just return their data
                done(null, result);
            }
        });
    });

    passport.deserializeUser(function (user, done) {
        db.collection('users').find({email: user.email}).toArray(function (err, result) {
            done(null, user);
        });
    });

    passport.use(new SamlStrategy(
        {
            path: config.passport.saml.callbackUrl,
            entryPoint: config.passport.saml.entryPoint,
            issuer: config.passport.saml.issuer
        },
        function (profile, done) {
            return done(null,
                {
                    id : profile.uid,
                    email : profile.email,
                    displayName : profile.cn,
                    firstName : profile.givenName,
                    lastName : profile.sn
                });
        }
    ));
};