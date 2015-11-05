/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var milestonesFactory = function ($http) {
        
        var factory = {},
            milestones = null;
            
//  Services related to "milestones"
        
        factory.getMilestones = function () {
            return $http.get('/api/milestones');
        };
        
        factory.getMilestonesByGroup = function (groupId) {
            return $http.get('/api/milestones?groupId=' + groupId);
        };
        
        factory.getMilestone = function (milestoneId) {
            return $http.get('/api/milestones/' + milestoneId);
        };
        
        factory.updateMilestone = function (milestone) {
            return $http.put('/api/milestones/' + milestone._id, milestone);
        };

        factory.deleteMilestone = function (milestoneId) {
            var method = "DELETE",
                url = '/api/milestones/' + milestoneId;
            return $http({ method: method, url: url });
        };
        
        factory.addMilestone = function (milestone) {
            return $http.post('/api/milestones', milestone);
        };
        
        return factory;
    };

    milestonesFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('milestonesFactory', milestonesFactory);
    
}());