/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var MilestonesCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, actionsFactory, groupsFactory, productsFactory, objectivesFactory, milestonesFactory) {
        
        function consolidateMilestonesWithObjectives() {
            var i = 0,
                j = 0;
            
            for (i = 0; i < $scope.objectives.length; i++) {
                $scope.objectives[i].milestones = [];

                for (j = 0; j < $scope.milestones.length; j++) {
                    if ($scope.objectives[i]._id === $scope.milestones[j].objectiveId) {
                        $scope.objectives[i].milestones.push($scope.milestones[j]);
                    }
                }

            }
        }

        
        function init() {
            
            groupsFactory.getOpsGroups().error(function (data, status, headers, config) {
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
 
        $scope.selectGroup = function () {

            // this function builds the objective/milestone list when the group selection is made by the user.  
            
            $scope.milestonesAvailable = false;
            var i = 0,
                j = 0;
            
            milestonesFactory.getMilestonesByGroup($scope.groupId).error(function (data, status, headers, config) {
                $log.warn('Server error getting Milestones documents: ', status);
            }).success(function (milestones) {
                if (milestones && milestones.length > 0) {
                    $scope.milestones = milestones;
                    $scope.milestonesAvailable = true;
                    consolidateMilestonesWithObjectives();
                }

                // Consolidate the group Milestones into the Objectives for presentation.

            });

        };
        
        $scope.selectCopyGroup = function () {
            $scope.showCopyGroups = true;
        };
        
        
        $scope.copyCancel = function () {
            $scope.showCopyGroups = false;
        };
        
        
        $scope.copyMilestones = function (sourceGroupId) {
            
            if ($scope.sourceGroupId === $scope.groupId) {
                $window.alert("\nSource and target groups must be different.\n");
                return;
            }

            milestonesFactory.getMilestonesByGroup(sourceGroupId).error(function (data, status, headers, config) {
                $window.alert("\nServer error retrieving source Milestones, status = ", status, "\n");
            }).success(function (srcMilestones) {
                var i = 0,
                    newMilestones = [];
                
                if (srcMilestones && srcMilestones.length > 0) {
                    for (i = 0; i < srcMilestones.length; i++) {
                        newMilestones.push(srcMilestones[i]);
                        newMilestones[i].groupId = $scope.groupId;
                        delete newMilestones[i]._id;
                    }
                
                    if (newMilestones.length > 0) {
                        milestonesFactory.addMilestone(newMilestones).error(function (data, status, headers, config) {
                            $log.warn("Server error adding new Milestones, status = ", status);
                        }).success(function (data) {
                            $scope.milestones = newMilestones;
                            $scope.milestonesAvailable = true;
                            $scope.showCopyGroups = false;
                            consolidateMilestonesWithObjectives();
                        });
                    }
                    
                } else {
                    $window.alert("\nNo Milestones available for the source Group, select another.\n");
                }
            });
        };
        
        init();
        
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
    
    MilestonesCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'actionsFactory', 'groupsFactory', 'productsFactory', 'objectivesFactory', 'milestonesFactory'];

    angular.module('portApp').controller('MilestonesCtrl', MilestonesCtrl);
    
}());