/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ProfileCtrl = function ($scope, $rootScope, $state, $log, $window, groupsFactory, Auth) {
        
        function init() {

            if ($rootScope.currentUser === null) {
                $state.go('home');
            } else {
                groupsFactory.getGroup($rootScope.currentUser.groupId).success(function (group) {
                    $scope.groupName = group.groupName;
                }).error(function (data, status, headers, config) {
                    $log.warn('Server error getting group document: ', status);
                });
            }
        }
        
        init();
        
    };
        
    ProfileCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'groupsFactory', 'Auth'];

    angular.module('portApp').controller('ProfileCtrl', ProfileCtrl);
    
}());