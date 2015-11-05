/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ReportsCtrl = function ($scope, $rootScope, $state, $log, $window, usersFactory) {

        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        function init() {
            if (!$rootScope.userAuthorized) {
                $window.alert("\nYou are not authorized to access this web site.\n (02.02)");
                $state.go("main");
            }
        }
        
        function authenticateUser() {

    // Authorize this report if logged in email is found in Players.
            usersFactory.getUserByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $window.alert("\nUnable to authenticate report at this time.\n (02.03)");
                    $state.go("main");
                })
                .success(function (user) {
                    $rootScope.userAuthenticated = true;
                    if (user.length === 1) {
                        if (user[0].admin) {
                            $rootScope.userAuthority = 3;
                        } else if (user[0].editor) {
                            $rootScope.userAuthority = 2;
                        } else {
                            $rootScope.userAuthority = 1;
                        }
                        
                        $rootScope.userAuthorized = true;
                        $rootScope.userId = user[0]._id;
                        init();
                    } else {
                        $window.alert("\nYou are not authorized to access this web site. (02.01)\n");
                        $state.go("main");
                    }
                });
        }

        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request report authentication with factory.
        } else {
            init();
        }
    };
        
    ReportsCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'usersFactory'];

    angular.module('portApp')
        .controller('ReportsCtrl', ReportsCtrl);
    
}());