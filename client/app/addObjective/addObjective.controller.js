/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var AddObjectiveCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, objectivesFactory) {
    
        function init() {
            $scope.objective = {};
        }
   
        init();
        
        /*  post a objective to the "objectives" collection */
        
        $scope.addObjective = function () {
            objectivesFactory.addObjective($scope.objective).error(function (data, status, headers, config) {
                $window.alert("Server error adding objective, status = ", status);
            }).success(function (data) {
                $state.go('objectives');
            });
        };
    };
    
    AddObjectiveCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'objectivesFactory'];

    angular.module('portApp').controller('AddObjectiveCtrl', AddObjectiveCtrl);
    
}());