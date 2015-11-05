/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var GroupsCtrl = function ($scope, $rootScope, $state, $log, $window, usersFactory, groupsFactory) {
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        function init() {
            $scope.gReverse = false;
            $scope.gSortBy = "groupNum";
            $scope.gSortGName = false;
            $scope.gSortGNum = true;
            
            if ($rootScope.userAuthorized) {
                groupsFactory.getGroups().success(function (groups) {
                    $scope.groups = groups;
                }).error(function (data, status, headers, config) {
                    $log.warn('Server error getting group documents: ', status);
                });
            } else {
                $window.alert("\nYou are not authorized to access this web site.\n (03.02)");
                $state.go("main");
            }
        }
        
        function authenticateUser() {

    // Authorize this user if logged in email is found in Players.
            usersFactory.getUserByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $window.alert("\nUnable to authenticate user at this time.\n (03.03)");
                    $state.go("main");
                })
                .success(function (user) {
                    $rootScope.userAuthority = 1;
                    if (user.length === 1) {
                        if (user[0].admin) {
                            $rootScope.userAuthority = 3;
                        } else if (user[0].editor) {
                            $rootScope.userAuthority = 2;
                        }
                        
                        $rootScope.userAuthorized = true;
                        $rootScope.userAuthenticated = true;
                        $rootScope.userId = user[0]._id;
                        init();
                    } else {
                        $window.alert("\nYou are not authorized to access this web site. (03.01)\n");
                        $state.go("main");
                    }
                });
        }

        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request user authentication with factory.
        } else {
            init();
        }
        
        
        $scope.doSort = function (propName) {
            if (propName === $scope.gSortBy) {
                $scope.gReverse = !$scope.gReverse;
            } else {
                $scope.gReverse = false;
                $scope.gSortGName = false;
                $scope.gSortGNum = false;
                $scope.gSortBy = propName;
                
                switch (propName) {
                case "groupName":
                    $scope.gSortGName = true;
                    break;
                case "groupNum":
                    $scope.gSortGNum = true;
                    break;
                default:
                    break;
                }
            }
        };
    };
    
    GroupsCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'usersFactory', 'groupsFactory'];

    angular.module('portApp').controller('GroupsCtrl', GroupsCtrl);
    
}());