/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('opsReadiness', {
                url: '/opsReadiness',
                templateUrl: 'app/controllers/editControllers/opsReadiness/opsReadiness.html',
                controller: 'OpsReadinessCtrl'
            });
    });