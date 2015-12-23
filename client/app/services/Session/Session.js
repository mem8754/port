/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var sessionFactory = function ($resource) {
        return $resource('/auth/session/');
    };

    sessionFactory.$inject = ['$resource'];
    
    angular.module('portApp').factory('Session', sessionFactory);
    
}());