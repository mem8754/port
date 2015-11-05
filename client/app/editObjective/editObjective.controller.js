/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditObjectiveCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, objectivesFactory) {
    
        function init() {
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
            objectivesFactory.updateObjective($scope.objective).error(function (data, status, headers, config) {
                $window.alert("System error updating objective in database:", status);
            }).success(function (data) {
                $state.go('objectives');
            });
        };
    };
    
    EditObjectiveCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'objectivesFactory'];

    angular.module('portApp').controller('EditObjectiveCtrl', EditObjectiveCtrl);
    
}());