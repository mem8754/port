/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var groupsFactory = function ($http) {
        
        var factory = {},
            groups = null;
            
//  Services related to "groups"
        
        factory.getGroups = function () {
            return $http.get('/api/groups');
        };
        
        factory.getOpsGroups = function () {
            return $http.get('/api/groups?opsGroups=true');
        };
        
        factory.getGroup = function (groupId) {
            return $http.get('/api/groups/' + groupId);
        };
        
        factory.getGroupsByName = function (groupName) {
            return $http.get('/api/groups?groupName=' + groupName);
        };
        
        factory.updateGroup = function (group) {
            return $http.put('/api/groups/' + group._id, group);
        };

        factory.deleteGroup = function (groupId) {
            var method = "DELETE",
                url = '/api/groups/' + groupId;
            return $http({ method: method, url: url });
        };
        
        factory.addGroup = function (group) {
            return $http.post('/api/groups', group);
        };
        
        return factory;
    };

    groupsFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('groupsFactory', groupsFactory);
    
}());