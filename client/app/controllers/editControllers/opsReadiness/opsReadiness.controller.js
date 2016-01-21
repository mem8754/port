/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var OpsReadinessCtrl = function ($scope, $rootScope, $state, $log, $window, usersFactory, groupsFactory) {
        
        function init() {
            
            groupsFactory.getOpsGroups().success(function (groups) {
                $scope.groups = groups;
            }).error(function (data, status, headers, config) {
                $log.warn('Server error getting Ops Groups documents: ', status);
            });
        }
        
        init();

    };
    
    OpsReadinessCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'usersFactory', 'groupsFactory'];

    angular.module('portApp').controller('OpsReadinessCtrl', OpsReadinessCtrl);
    
}());