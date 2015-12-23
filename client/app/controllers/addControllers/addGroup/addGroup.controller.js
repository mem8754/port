/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var AddGroupCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, groupsFactory, Auth) {
    
        function init() {
            
            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to perform this action.\n");
                $state.go('home');
            }

            $scope.group = {};
        }
   
        init();
        
        /*  post a group to the "groups" collection */
        
        $scope.addGroup = function () {
            groupsFactory.getGroupsByName($scope.group.groupName).error(function (data, status, headers, config) {
                $window.alert("\nSystem error reading database, status = ", status, "\n\n");
            }).success(function (groups) {
                if (groups.length > 0) {
                    $window.alert("\nSpecified group name already exists, please use a different name for this group.\n");
                    return;
                }
                groupsFactory.addGroup($scope.group).error(function (data, status, headers, config) {
                    $window.alert("Server error adding group, status = ", status);
                }).success(function (data) {
                    $state.go('groups');
                });
            });
        };
    };
    
    AddGroupCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'groupsFactory', 'Auth'];

    angular.module('portApp')
        .controller('AddGroupCtrl', AddGroupCtrl);
    
}());