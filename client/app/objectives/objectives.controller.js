/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ObjectivesCtrl = function ($scope, $rootScope, $state, $log, $window, objectivesFactory, usersFactory) {
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        function init() {
            $scope.oReverse = false;
            $scope.oSortBy = "objectiveSequence";
            $scope.oSortPhase = false;
            $scope.oSortObjective = false;
            $scope.oSortSequence = true;
            
            if ($rootScope.userAuthorized) {
                objectivesFactory.getObjectives().error(function (data, status, headers, config) {
                    $log.warn('Server error getting objectives documents: ', status);
                }).success(function (objectives) {
                    $scope.objectives = objectives;
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
    
    ObjectivesCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'objectivesFactory', 'usersFactory'];

    angular.module('portApp').controller('ObjectivesCtrl', ObjectivesCtrl);
    
}());