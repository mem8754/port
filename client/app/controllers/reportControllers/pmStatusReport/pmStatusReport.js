/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('pmStatusReport', {
                url: '/report/pmStatus',
                templateUrl: 'app/controllers/reportControllers/pmStatusReport/pmStatusReport.html',
                controller: 'ProductManagerStatusReportCtrl'
            });
    });