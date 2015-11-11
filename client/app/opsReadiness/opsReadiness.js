/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('opsReadiness', {
                url: '/opsReadiness',
                templateUrl: 'app/opsReadiness/opsReadiness.html',
                controller: 'OpsReadinessCtrl'
            });
    });