/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/controllers/authControllers/signup/signup.html',
                controller: 'SignupCtrl'
            });
    });