/*jslint node: true, nomen: true, plusplus: true */
/*global angular */

(function () {
    'use strict';

    var AddMilestoneCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, milestonesFactory, groupsFactory, objectivesFactory, Auth) {
    
        function init() {
            
            var groupId = $stateParams.id;
            
            if (!Auth.isGroupEditor(groupId)) {
                $window.alert("\nYou must have Admin or Edit authority to perform this action.\n");
                $state.go('milestones');
            }

            $scope.phases = [
                { num: 0, name: "Discovery"   },
                { num: 1, name: "Development" },
                { num: 2, name: "Pilot"       },
                { num: 3, name: "Pre-Launch"  },
                { num: 4, name: "Post-Launch" }
            ];
            
            $scope.milestone = {};
            
            groupsFactory.getGroup(groupId).error(function (data, status, headers, config) {
                $window.alert("System error reading Group details.");
            }).success(function (group) {
                $scope.milestone.groupId = group;
            });
            
        }
   
        init();
        
        /*  update the milestone through the Factory */
        
        $scope.addNewMilestone = function () {
            
            milestonesFactory.addMilestone($scope.milestone).error(function (data, status, headers, config) {
                $window.alert("System error adding Milestone to database.");
            }).success(function (data) {
                $state.go('milestones');
                
            });

        };

        $scope.readPhaseObjectives = function () {
            
            objectivesFactory.getObjectivesByPhase($scope.milestone.phaseNum).error(function (data, status, headers, config) {
                $log.warn("Add Milestone - server error reading Objectives: ", status);
            }).success(function (groups) {
                
                $scope.objectives = groups.objSort("objectiveSequence");
            });
        };
        
    };
    
    
    
    AddMilestoneCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'milestonesFactory', 'groupsFactory', 'objectivesFactory', 'Auth'];

    angular.module('portApp')
        .controller('AddMilestoneCtrl', AddMilestoneCtrl);
    
}());