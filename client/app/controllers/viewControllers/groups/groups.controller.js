/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var GroupsCtrl = function ($scope, $rootScope, $state, $log, $window, groupsFactory, Auth) {
        
        function init() {
            $scope.gReverse = false;
            $scope.gSortBy = "opsId";
            $scope.gSortGName = false;
            $scope.gSortGNum = false;
            $scope.gSortOpsId = true;
            
            groupsFactory.getGroups().success(function (groups) {
                $scope.groups = groups;
            }).error(function (data, status, headers, config) {
                $log.warn('Server error getting group documents: ', status);
            });
        }
        
        
        init();
        
        $scope.editGroup = function (groupId) {
            
            if (Auth.isGroupEditor(groupId)) {
                $state.go("editGroup", { id: groupId });
            } else {
                $window.alert("\nYou must have Admin or Edit authority to perform this action.\n");
            }
        };
        
        $scope.doSort = function (propName) {
            if (propName === $scope.gSortBy) {
                $scope.gReverse = !$scope.gReverse;
            } else {
                $scope.gReverse = false;
                $scope.gSortGName = false;
                $scope.gSortGNum = false;
                $scope.gSortOpsId = false;
                $scope.gSortBy = propName;
                
                switch (propName) {
                case "groupName":
                    $scope.gSortGName = true;
                    break;
                case "groupNum":
                    $scope.gSortGNum = true;
                    break;
                case "opsId":
                    $scope.gSortOpsId = true;
                    break;
                default:
                    break;
                }
            }
        };
    };
    
    GroupsCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'groupsFactory', 'Auth'];

    angular.module('portApp').controller('GroupsCtrl', GroupsCtrl);
    
}());