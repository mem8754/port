/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addUser', {
                url: '/addUser',
                templateUrl: 'app/addUser/addUser.html',
                controller: 'AddUserCtrl'
            });
    });