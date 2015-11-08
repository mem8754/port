/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('pmStatusReport', {
                url: '/report/pmStatus',
                templateUrl: 'app/pmStatusReport/pmStatusReport.html',
                controller: 'ProductManagerStatusReportCtrl'
            });
    });