/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var SignupCtrl = function ($scope, Auth, $location) {

        $scope.register = function (form) {
            
            $scope.user.approved = false;                   /*  enter the new user as "not approved", allow admins to approve authority and assign groupId. */
            
            $scope.verifyFail = false;                      /*  ensure password fields match before saving new user record.                                 */
            if ($scope.user.password !== $scope.user.confirmPassword) {
                $scope.verifyFail = true;
            }
            
            //  Determine the user's requested level of authority from the "desiredAuthority" scope variable, and update the appropriate parameter in the new user record.
            $scope.user.admin = false;
            $scope.user.editor = false;
            
            switch ($scope.desiredAuthority) {
            case "editor":
                $scope.user.editor = true;
                break;
            case "admin":
                $scope.user.admin = true;
                break;
            default:
                break;
            }
            
            if ($scope.desiredAuthority === "editor") {
                $scope.user.editor = true;
                $scope.authSelFail = false;
            } else if ($scope.desiredAuthority === "admin") {
                $scope.user.admin = true;
                $scope.authSelFail = false;
            }
            
            if (!$scope.verifyFail) {
                Auth.createUser(
                    {
                        email       :   $scope.user.email,
                        firstName   :   $scope.user.firstName,
                        lastName    :   $scope.user.lastName,
                        editor      :   $scope.user.editor,
                        admin       :   $scope.user.admin,
                        approved    :   $scope.user.approved,
                        password    :   $scope.user.password
                    },
                    function (err) {
                        $scope.errors = {};

                        if (!err) {
                            $location.path('/');
                        } else {
                            angular.forEach(err.errors, function (error, field) {
                                form[field].$setValidity('mongoose', false);
                                $scope.errors[field] = error.type;
                            });
                        }
                    }
                );
            }
        };
    };
        
    SignupCtrl.$inject = ['$scope', 'Auth', '$location'];

    angular.module('portApp')
        .controller('SignupCtrl', SignupCtrl);
    
}());