/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                templateUrl: 'app/controllers/viewControllers/users/users.html',
                controller: 'UsersCtrl'
            });
    });