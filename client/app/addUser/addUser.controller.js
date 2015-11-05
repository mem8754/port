/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var AddUserCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, usersFactory, groupsFactory) {
    
        function init() {
            var i = 0;
            $scope.user = {};
            $scope.groups = null;

            groupsFactory.getGroups()
                .error(function (data, status, headers, config) {
                    $log.warn("Add User - server error reading groups info: ", status);
                })
                .success(function (groups) {
                    $scope.groups = groups.objSort("groupName");
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.addUser = function () {
            usersFactory.getUserByEmail($scope.user.email).error(function (data, status, headers, config) {
                $window.alert("System error reading database.");
            }).success(function (users) {
                if (users.length > 0) {
                    $window.alert("Specified user email already exists, please enter a different email.");
                    return;
                }
                if ($scope.user.admin) {                /* if admin authority specified, turn off editor authority */
                    $scope.user.editor = false;
                }
                
                usersFactory.addUser($scope.user).error(function (data, status, headers, config) {
                    $window.alert("Server error " + status + " adding user.");
                }).success(function (data) {
                    $state.go('users');
                });
            });
        };
    };
    
    AddUserCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'usersFactory', 'groupsFactory'];

    angular.module('portApp')
        .controller('AddUserCtrl', AddUserCtrl);
    
}());