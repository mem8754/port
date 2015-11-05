/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditUserCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, usersFactory, groupsFactory) {
    
        function init() {
            var i = 0,
                userId = $stateParams.id;
            
            $scope.groups = null;
            
            usersFactory.getUser(userId).error(function (data, status, headers, config) {
                $window.alert("System error reading user details.");
            }).success(function (user) {
                $scope.user = user;
            });
            
            groupsFactory.getGroups().error(function (data, status, headers, config) {
                $log.warn("Edit User - server error reading groups: ", status);
            }).success(function (groups) {
                $scope.groups = groups.objSort("groupName");
            });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateUser = function () {
            if ($scope.user.admin) {
                $scope.user.editor = false;
            }
            usersFactory.updateUser($scope.user).error(function (data, status, headers, config) {
                $window.alert("System error updating user in database.");
            }).success(function (data) {
                $state.go('users');
            });
        };
    };
    
    EditUserCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'usersFactory', 'groupsFactory'];

    angular.module('portApp')
        .controller('EditUserCtrl', EditUserCtrl);
    
}());