/*jslint node: true, nomen: true  */
/*global angular  */

angular.module('portApp')
    .config(function ($stateProvider) {
        'use strict';
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            });
    });