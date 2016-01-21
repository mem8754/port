/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';

    var EditUserCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, usersFactory, groupsFactory, Auth) {
    
        function init() {

            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to edit Users.\n");
                $state.go('home');
            }
            
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

            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to update Users.\n");
                $state.go('home');
            }
            
            if ($scope.user.admin) {
                $scope.user.editor = false;
            }
            usersFactory.updateUser($scope.user).error(function (data, status, headers, config) {
                if (status === 401 && !$scope.currentUser) {
                    $window.alert("\nYou must be logged in to make updates to entries.\n");
                } else {
                    $window.alert("\nSystem error " + status + " updating user in database.\n");
                }
                
            }).success(function (data) {
                $state.go('users');
            });
        };
        
        $scope.removeUser = function (userId) {
            if (!Auth.isAdmin()) {
                $window.alert("\nYou must have Admin authority to delete Users.\n");
                $state.go('users');
            }
            
            usersFactory.getUser(userId).error(function (data, status, headers, config) {
                $window.alert("Server error " + status + " retrieving User.");
            }).success(function (user) {
                var userResp = $window.confirm('Remove user "' + user.firstName + ' ' + user.lastName + '"?');
                if (userResp) {
                    usersFactory.removeUser(user._id).error(function (data, status, headers, config) {    /*  Step 3  */
                        $window.alert("\nServer error " + status + " removing User from database.\n");
                    }).success(function (data) {
                        $window.alert("\nUser successfully deleted from database.\n");
                        $state.go('users');
                    });
                }
            });
        };
        
    };
    
    EditUserCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'usersFactory', 'groupsFactory', 'Auth'];

    angular.module('portApp')
        .controller('EditUserCtrl', EditUserCtrl);
    
}());