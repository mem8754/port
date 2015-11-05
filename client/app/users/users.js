/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                templateUrl: 'app/users/users.html',
                controller: 'UsersCtrl'
            });
    });