/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var actionsFactory = function ($http) {
        
        var factory = {},
            actions = null;
            
//  Services related to "actions"
        
        factory.getActions = function () {
            return $http.get('/api/actions');
        };
        
        factory.getActionsByProductAndGroup = function (productId, groupId) {
            return $http.get('/api/actions?productId=' + productId + '&groupId=' + groupId);
        };
        
        factory.getActionsByGroup = function (groupId) {
            return $http.get('/api/actions?groupId=' + groupId);
        };
        
        factory.getActionsByProductGroupPhase = function (productId, groupId, phaseNum) {
            return $http.get('/api/actions?productId=' + productId + '&groupId=' + groupId + '&phaseNum=' + phaseNum);
        };
        
        factory.getAction = function (actionId) {
            return $http.get('/api/actions/' + actionId);
        };
        
        factory.updateAction = function (action) {
            return $http.put('/api/actions/' + action._id, action);
        };

        factory.deleteAction = function (actionId) {
            var method = "DELETE",
                url = '/api/actions/' + actionId;
            return $http({ method: method, url: url });
        };
        
        factory.addAction = function (action) {
            return $http.post('/api/actions', action);
        };
        
        return factory;
    };

    actionsFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('actionsFactory', actionsFactory);
    
}());