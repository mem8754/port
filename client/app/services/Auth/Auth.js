/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var authFactory = function ($location, $rootScope, Session, User, $cookieStore) {

        var factory = {};
        $rootScope.currentUser = $cookieStore.get('user') || null;
        $cookieStore.remove('user');

        factory.login = function (provider, user, callback) {
            var cb = callback || angular.noop;
            Session.save(
                {
                    provider    : provider,
                    email       : user.email,
                    password    : user.password
                },
                function (user) {
                    $rootScope.currentUser = user;
                    return cb();
                },
                function (err) {
                    return cb(err.data);
                }
            );
        };

        factory.logout = function (callback) {
            var cb = callback || angular.noop;
            Session.delete(
                function (res) {
                    $rootScope.currentUser = null;
                    return cb();
                },
                function (err) {
                    return cb(err.data);
                }
            );
        };

        factory.createUser = function (userinfo, callback) {
            var cb = callback || angular.noop;
            User.save(userinfo, function (user) { return cb(); }, function (err) { return cb(err.data); });
        };

        factory.currentUser = function () {
            Session.get(function (user) {
                $rootScope.currentUser = user;
            });
        };


        factory.changePassword = function (email, oldPassword, newPassword, callback) {
            var cb = callback || angular.noop;
            User.update(
                {
                    email: email,
                    oldPassword: newPassword,
                    newPassword: newPassword
                },
                function (user) {
                    console.log('password changed');
                    return cb();
                },
                function (err) {
                    return cb(err.data);
                }
            );
        };
        
        factory.isEditor = function () {
            if ($rootScope.currentUser && ($rootScope.currentUser.admin || $rootScope.currentUser.editor)) {
                return true;
            }
            return false;
        };
        
        factory.isGroupEditor = function (groupId) {
            if ($rootScope.currentUser
                    && ($rootScope.currentUser.admin
                    || ($rootScope.currentUser.editor
                        && $rootScope.currentUser.groupId === groupId))) {
                return true;
            }
            return false;
        };
        
        factory.isAdmin = function () {
            if ($rootScope.currentUser && $rootScope.currentUser.admin) {
                return true;
            }
            return false;
        };

        return factory;
    };

    authFactory.$inject = ['$location', '$rootScope', 'Session', 'User', '$cookieStore'];
    
    angular.module('portApp').factory('Auth', authFactory);
    
}());