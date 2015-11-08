/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('productDetailStatusReport', {
                url: '/report/detailStatus',
                templateUrl: 'app/productDetailStatusReport/productDetailStatusReport.html',
                controller: 'ProductDetailStatusReportCtrl'
            });
    });