/*jslint node: true, nomen: true  */
/*global angular  */

(function () {
    'use strict';
    var usersFactory = function ($http) {
        
        var factory = {},
            users = null;
            
//  Services related to "users"
        
        factory.getUsers = function () {
            return $http.get('/api/users');
        };
        
        factory.getUserByEmail = function (email) {
            return $http.get('/api/users?email=' + email);
        };
        
        factory.getUser = function (userId) {
            return $http.get('/api/users/' + userId);
        };
        
        factory.updateUser = function (user) {
            return $http.put('/api/users/' + user._id, user);
        };

        factory.addUser = function (user) {
            return $http.post('/api/users', user);
        };
        
        return factory;
    };

    usersFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('usersFactory', usersFactory);
    
}());