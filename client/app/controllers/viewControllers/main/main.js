/*jslint node: true, nomen: true  */
/*global angular  */

angular.module('portApp')
    .config(function ($stateProvider) {
        'use strict';
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/controllers/viewControllers/main/main.html',
                controller: 'MainCtrl'
            });
    });