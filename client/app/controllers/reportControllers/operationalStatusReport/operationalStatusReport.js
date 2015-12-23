/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('operationalStatusReport', {
                url: '/report/opsStatus',
                templateUrl: 'app/controllers/reportControllers/operationalStatusReport/operationalStatusReport.html',
                controller: 'OperationalStatusReportCtrl'
            });
    });