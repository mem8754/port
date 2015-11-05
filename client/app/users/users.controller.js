/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var UsersCtrl = function ($scope, $rootScope, $state, $log, $window, usersFactory, groupsFactory) {

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
            if ($rootScope.userAuthorized) {
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
            } else {
                $window.alert("\nYou are not authorized to access this web site.\n (02.02)");
                $state.go("main");
            }
        }
        
        function authenticateUser() {

    // Authorize this user if logged in email is found in Players.
            usersFactory.getUserByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $window.alert("\nUnable to authenticate user at this time.\n (02.03)");
                    $state.go("main");
                })
                .success(function (user) {
                    $rootScope.userAuthenticated = true;
                    $rootScope.userAuthority = 1;
                    if (user.length === 1) {
                        if (user[0].admin) {
                            $rootScope.userAuthority = 3;
                        } else if (user[0].editor) {
                            $rootScope.userAuthority = 2;
                        }
                        
                        $rootScope.userAuthorized = true;
                        $rootScope.userId = user[0]._id;
                        init();
                    } else {
                        $window.alert("\nYou are not authorized to access this web site. (02.01)\n");
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
    };
    
    UsersCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'usersFactory', 'groupsFactory'];

    angular.module('portApp')
        .controller('UsersCtrl', UsersCtrl);
    
}());