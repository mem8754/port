/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

(function () {
    'use strict';
    var objectivesFactory = function ($http) {
        
        var factory = {},
            objectives = null;
            
//  Services related to "objectives"
        
        factory.getObjectives = function () {
            return $http.get('/api/objectives');
        };
        
        factory.getObjectivesByPhase = function (phase) {
            return $http.get('/api/objectives?productPhaseNum=' + phase);
        };
        
        factory.getObjective = function (objectiveId) {
            return $http.get('/api/objectives/' + objectiveId);
        };
        
        factory.updateObjective = function (objective) {
            return $http.put('/api/objectives/' + objective._id, objective);
        };

        factory.deleteObjective = function (objectiveId) {
            var method = "DELETE",
                url = '/api/objectives/' + objectiveId;
            return $http({ method: method, url: url });
        };
        
        factory.addObjective = function (objective) {
            return $http.post('/api/objectives', objective);
        };
        
        return factory;
    };

    objectivesFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('objectivesFactory', objectivesFactory);
    
}());