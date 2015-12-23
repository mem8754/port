/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addUser', {
                url: '/addUser',
                templateUrl: 'app/controllers/addControllers/addUser/addUser.html',
                controller: 'AddUserCtrl'
            });
    });