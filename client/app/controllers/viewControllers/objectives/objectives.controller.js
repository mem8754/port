/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ObjectivesCtrl = function ($scope, $rootScope, $state, $log, $window, objectivesFactory) {
        
        function init() {
            $scope.oReverse = false;
            $scope.oSortBy = "objectiveSequence";
            $scope.oSortPhase = false;
            $scope.oSortObjective = false;
            $scope.oSortSequence = true;
            
            objectivesFactory.getObjectives().error(function (data, status, headers, config) {
                $log.warn('Server error getting objectives documents: ', status);
            }).success(function (objectives) {
                $scope.objectives = objectives;
            });
        }
        
        init();
        
        $scope.doSort = function (propName) {
            if (propName === $scope.oSortBy) {
                $scope.oReverse = !$scope.oReverse;
            } else {
                $scope.oReverse = false;
                $scope.oSortPhase = false;
                $scope.oSortObjective = false;
                $scope.oSortSequence = false;
                $scope.oSortBy = propName;
                
                switch (propName) {
                case "productPhase":
                    $scope.oSortPhase = true;
                    break;
                case "phaseObjective":
                    $scope.oSortObjective = true;
                    break;
                case "objectiveSequence":
                    $scope.oSortSequence = true;
                    break;
                default:
                    break;
                }
            }
        };
    };
    
    ObjectivesCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'objectivesFactory'];

    angular.module('portApp').controller('ObjectivesCtrl', ObjectivesCtrl);
    
}());