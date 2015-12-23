/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var statusFactory = function ($http) {
        
        var factory = {},
            phases = null;
            
//  Services related to "phases"
        
        factory.getAllStatus = function () {
            return $http.get('/api/phases');
        };
        
        factory.getStatusByProductAndPhase = function (productId, phase) {
            return $http.get('/api/phases?productId=' + productId + '&phase=' + phase);
        };
        
        factory.getStatusByProduct = function (productId) {
            return $http.get('/api/phases?productId=' + productId);
        };
        
        factory.getStatus = function (statusId) {
            return $http.get('/api/phases/' + statusId);
        };
        
        factory.updateStatus = function (status) {
            return $http.put('/api/phases/' + status._id, status);
        };

        factory.deleteStatus = function (statusId) {
            var method = "DELETE",
                url = '/api/phases/' + statusId;
            return $http({ method: method, url: url });
        };
        
        factory.addStatus = function (status) {
            return $http.post('/api/phases', status);
        };
        
        return factory;
    };

    statusFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('statusFactory', statusFactory);
    
}());