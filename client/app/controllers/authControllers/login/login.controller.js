/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var LoginCtrl = function ($scope, Auth, $state) {
        $scope.error = {};
        $scope.user = {};

        $scope.login = function (form) {
            var userRec = { email: $scope.user.email,
                            password: $scope.user.password };
            Auth.login('password', userRec, function (err) {
                $scope.errors = {};

                if (!err) {
                    $state.go('main');
                } else {
                    angular.forEach(err.errors, function (error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.type;
                    });
                    $scope.error.other = err.message;
                }
            });
        };
    };
    
    
    LoginCtrl.$inject = ['$scope', 'Auth', '$state'];

    angular.module('portApp')
        .controller('LoginCtrl', LoginCtrl);
    
}());