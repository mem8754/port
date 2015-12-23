/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditGroupCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, groupsFactory, Auth) {
    
        function init() {
            var groupId = $stateParams.id;

            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to edit Groups.\n");
                $state.go('home');
            }
            
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
            
            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to update Groups.\n");
                $state.go('home');
            }
            
            groupsFactory.updateGroup($scope.group).error(function (data, status, headers, config) {
                $window.alert("System error updating group in database:", status);
            }).success(function (data) {
                $state.go('groups');
            });
        };
    };
    
    EditGroupCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'groupsFactory', 'Auth'];

    angular.module('portApp').controller('EditGroupCtrl', EditGroupCtrl);
    
}());