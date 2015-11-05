/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var MilestonesCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, actionsFactory, usersFactory, groupsFactory, productsFactory, objectivesFactory, milestonesFactory) {
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        function init() {
            
            if (!$rootScope.userAuthorized) {
                
                $window.alert("\nYou are not authorized to access this web site.\n (03.02)");
                $state.go("main");
                
            } else {
                
                groupsFactory.getGroups().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Groups documents: ', status);
                }).success(function (groups) {
                    $scope.groups = groups;
                });
                
                objectivesFactory.getObjectives().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Objectives documents: ', status);
                }).success(function (objectives) {
                    $scope.objectives = objectives;

                    
                });

            }
        }
 
        $scope.selectGroup = function () {

            // this function builds the objective/milestone list when the group selection is made by the user.  
            
            $scope.milestonesAvailable = false;
            var i = 0,
                j = 0;
            
            milestonesFactory.getMilestonesByGroup($scope.groupId).error(function (data, status, headers, config) {
                $log.warn('Server error getting Milestones documents: ', status);
            }).success(function (milestones) {
                $scope.milestones = milestones;
                if (milestones && milestones.length > 0) {
                    $scope.milestonesAvailable = true;
                }

                // Insert the group Milestones into the Objectives to consolidate the data for presentation.

                for (i = 0; i < $scope.objectives.length; i++) {
                    $scope.objectives[i].milestones = [];

                    for (j = 0; j < $scope.milestones.length; j++) {
                        if ($scope.objectives[i]._id === $scope.milestones[j].objectiveId) {
                            $scope.objectives[i].milestones.push($scope.milestones[j]);
                        }
                    }

                }
            });

        };
        
        function authenticateUser() {

    // Authorize this user if logged in email is found in Users.
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
            if (propName === $scope.mSortBy) {
                $scope.mReverse = !$scope.mReverse;
            } else {
                $scope.mReverse = false;
                $scope.mSortMilestone = false;
                $scope.mSortSequence = false;
                $scope.mSortBy = propName;
                
                switch (propName) {
                case "objectiveMilestone":
                    $scope.oSortMilestone = true;
                    break;
                case "milestoneSequence":
                    $scope.oSortSequence = true;
                    break;
                default:
                    break;
                }
            }
        };
    };
    
    MilestonesCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'actionsFactory', 'usersFactory', 'groupsFactory', 'productsFactory', 'objectivesFactory', 'milestonesFactory'];

    angular.module('portApp').controller('MilestonesCtrl', MilestonesCtrl);
    
}());