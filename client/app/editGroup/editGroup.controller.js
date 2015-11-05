/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditGroupCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, groupsFactory) {
    
        function init() {
            var groupId = $stateParams.id;
            
            $scope.group = null;
            
            groupsFactory.getGroup(groupId).error(function (data, status, headers, config) {
                $window.alert("System error reading group record: ", status);
            }).success(function (group) {
                $scope.group = group;
            });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateGroup = function () {
            groupsFactory.updateGroup($scope.group).error(function (data, status, headers, config) {
                $window.alert("System error updating group in database:", status);
            }).success(function (data) {
                $state.go('groups');
            });
        };
    };
    
    EditGroupCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'groupsFactory'];

    angular.module('portApp').controller('EditGroupCtrl', EditGroupCtrl);
    
}());