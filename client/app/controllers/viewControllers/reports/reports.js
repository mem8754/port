/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('reports', {
                url: '/reports',
                templateUrl: 'app/controllers/viewControllers/reports/reports.html',
                controller: 'ReportsCtrl'
            });
    });