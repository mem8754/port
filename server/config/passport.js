/*jslint node: true, nomen: true  */

var LdapStrategy = require('passport-ldapauth');

module.exports = function (passport, config, db) {
    'use strict';
    
    var OPTS =
        {
            server:
                {
                    url: 'ldap://dc01.ena.com:389',
                    bindDn: 'cn=root',
                    bindCredentials: 'secret',
                    searchBase: 'ou=passport-ldapauth',
                    searchFilter: '(uid={{username}})'
                }
        };
    
    passport.serializeUser(function (user, done) {
        db.collection('users').find({email: user.email}).toArray(function (err, result) {
            console.log("Passport serialize user: " + user);
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
        console.log("Passport de-serialize user: " + user);
        db.collection('users').find({email: user.email}).toArray(function (err, result) {
            console.log("Passport de-serialize result: " + result);
            done(null, user);
        });
    });

    passport.use(new LdapStrategy(OPTS));

    /*
    passport.use(new SamlStrategy(
        {
            path        :   config.passport.saml.path,
            entryPoint  :   config.passport.saml.entryPoint,
            issuer      :   config.passport.saml.issuer
        },
        function (profile, done) {
            console.log("Returning SAML authentication: " + profile);
            return done(null,
                {
                    id                  :   profile.uid,
                    email               :   profile.email,
                    displayName         :   profile.cn,
                    firstName           :   profile.givenName,
                    lastName            :   profile.sn,
                    sessionIndex        :   profile.sessionIndex,
                    saml                :
                        {
                            nameID          :   profile.nameID,
                            nameIDFormat    :   profile.nameIDFormat,
                            token           :   profile.getAssertionXml()
                        }
                });
        }
    ));
    */
};