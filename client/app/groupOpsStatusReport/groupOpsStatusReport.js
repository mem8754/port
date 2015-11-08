/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('groupOpsStatusReport', {
                url: '/report/groupStatus',
                templateUrl: 'app/groupOpsStatusReport/groupOpsStatusReport.html',
                controller: 'GroupOpsStatusReportCtrl'
            });
    });