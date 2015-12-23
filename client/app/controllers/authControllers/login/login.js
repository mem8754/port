/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/controllers/authControllers/login/loginOld.html',
                controller: 'LoginCtrl'
            });
    });