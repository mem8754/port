/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditObjectiveCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, objectivesFactory, Auth) {
    
        function init() {

            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to edit Objectives.\n");
                $state.go('objectives');
            }
            
            var objectiveId = $stateParams.id;
            
            $scope.objective = null;
            
            objectivesFactory.getObjective(objectiveId).error(function (data, status, headers, config) {
                $window.alert("System error reading objective record: ", status);
            }).success(function (objective) {
                $scope.objective = objective;
            });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateObjective = function () {

            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to update Objectives.\n");
                $state.go('objectives');
            }
            
            objectivesFactory.updateObjective($scope.objective).error(function (data, status, headers, config) {
                $window.alert("System error updating objective in database:", status);
            }).success(function (data) {
                $state.go('objectives');
            });
        };
    };
    
    EditObjectiveCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'objectivesFactory', 'Auth'];

    angular.module('portApp').controller('EditObjectiveCtrl', EditObjectiveCtrl);
    
}());