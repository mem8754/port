/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('productSummaryReport', {
                url: '/report/productSummary',
                templateUrl: 'app/controllers/reportControllers/productSummaryReport/productSummaryReport.html',
                controller: 'ProductSummaryReportCtrl'
            });
    });