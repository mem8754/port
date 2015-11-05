/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditMilestoneCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, milestonesFactory, groupsFactory, objectivesFactory) {
    
        function init() {
            var i = 0,
                milestoneId = $stateParams.id;
            
            $scope.objLoaded = false;
            $scope.phases = [
                { num: 0, name: "Discovery"   },
                { num: 1, name: "Development" },
                { num: 2, name: "Pilot"       },
                { num: 3, name: "Pre-Launch"  },
                { num: 4, name: "Post-Launch" }
            ];
            
            milestonesFactory.getMilestone(milestoneId).error(function (data, status, headers, config) {
                $window.alert("System error reading Milestone details.");
            }).success(function (milestone) {
                $scope.milestone = milestone;
            
                groupsFactory.getGroup(milestone.groupId).error(function (data, status, headers, config) {
                    $window.alert("System error reading Group details.");
                }).success(function (group) {
                    $scope.group = group;
                });
                
                if (milestone.phaseNum) {
                    objectivesFactory.getObjectivesByPhase(milestone.phaseNum).error(function (data, status, headers, config) {
                        $log.warn("Edit Milestone - server error reading initial Objectives: ", status);
                    }).success(function (objectives) {
                        $scope.objectives = objectives;
                    });
                }
            });
            
        }
   
        init();
        
        /*  update the milestone through the Factory */
        
        $scope.updateMilestone = function () {
            
            milestonesFactory.updateMilestone($scope.milestone).error(function (data, status, headers, config) {
                $window.alert("System error updating Milestone in database.");
            }).success(function (data) {
                $state.go('milestones');
            });

        };

        $scope.readPhaseObjectives = function () {
            
            objectivesFactory.getObjectivesByPhase($scope.milestone.phaseNum).error(function (data, status, headers, config) {
                $log.warn("Edit Milestone - server error reading Objectives: ", status);
            }).success(function (objectives) {
                $scope.objectives = objectives.objSort("objectiveSequence");
                if (objectives.length > 0) {
                    $scope.objLoaded = true;
                }
            });
        };
        
    };
    
    
    
    EditMilestoneCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'milestonesFactory', 'groupsFactory', 'objectivesFactory'];

    angular.module('portApp')
        .controller('EditMilestoneCtrl', EditMilestoneCtrl);
    
}());