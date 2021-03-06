/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var UsersCtrl = function ($scope, $rootScope, $state, $log, $window, usersFactory, groupsFactory, Auth) {

        if (!Auth.isAdmin()) {
            $window.alert("\nYou must have Admin authority to access User data.\n");
            $state.go('main');
        }
        $scope.uSortBy = 'lastName';
        $scope.uReverse = false;
        $scope.uSortLN = true;
        $scope.uSortFN = false;
        $scope.uSortEmail = false;
        $scope.uSortGroup = false;
        
        $scope.users = [];
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        function init() {
            usersFactory.getUsers().error(function (data, status, headers, config) {
                $log.warn('Server error getting user documents: ', status);
            }).success(function (users) {
                $scope.users = users;
                groupsFactory.getGroups().error(function (data, status, headers, config) {
                    $log.warn('Server error getting groups: ', status);
                }).success(function (groups) {
                    var i = 0,
                        j = 0;
                    $scope.groups = groups;
                    for (i = 0; i < $scope.users.length; i++) {
                        for (j = 0; j < $scope.groups.length; j++) {
                            if ($scope.users[i].groupId === $scope.groups[j]._id) {
                                $scope.users[i].groupName = $scope.groups[j].groupName;
                                break;
                            }
                        }
                    }
                });
            });
        }
        
        
        $scope.approveUser = function (user) {
            user.approved = true;
            usersFactory.updateUser(user).error(function (data, status, headers, config) {
                $window.alert('\nServer error updating user authorization.\n');
            }).success(function (data) {
                $log.log('User authorization for ID ' + user._id + ' approved.');
            });
            $state.go('users');
        };
        
        
        $scope.doSort = function (propName) {
            if (propName === $scope.uSortBy) {
                $scope.uReverse = !$scope.uReverse;
            } else {
                $scope.uReverse = false;
                $scope.uSortLN = false;
                $scope.uSortFN = false;
                $scope.uSortEmail = false;
                $scope.uSortGroup = false;
                
                $scope.uSortBy = propName;
                
                switch (propName) {
                case "email":
                    $scope.uSortEmail = true;
                    break;
                case "lastName":
                    $scope.uSortLN = true;
                    break;
                case "firstName":
                    $scope.uSortFN = true;
                    break;
                case "groupName":
                    $scope.uSortGroup = true;
                    break;
                default:
                    break;
                }

            }
        };
        

        init();
        
    };
    
    UsersCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'usersFactory', 'groupsFactory', 'Auth'];

    angular.module('portApp')
        .controller('UsersCtrl', UsersCtrl);
    
}());